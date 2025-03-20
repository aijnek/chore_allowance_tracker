import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ChoreRecord } from '../types';
import { createErrorResponse, createSuccessResponse, dynamoDb, RECORDS_TABLE, CHORES_TABLE, CHILDREN_TABLE } from '../utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, pathParameters, body } = event;
    
    // GET /records
    if (httpMethod === 'GET' && path === '/records') {
      const result = await dynamoDb.scan({
        TableName: RECORDS_TABLE,
      }).promise();
      
      return createSuccessResponse(result.Items);
    }
    
    // GET /records/{id}
    if (httpMethod === 'GET' && path.match(/^\/records\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing record ID');
      }
      
      const result = await dynamoDb.get({
        TableName: RECORDS_TABLE,
        Key: { id },
      }).promise();
      
      if (!result.Item) {
        return createErrorResponse(404, 'Record not found');
      }
      
      return createSuccessResponse(result.Item);
    }
    
    // POST /records
    if (httpMethod === 'POST' && path === '/records') {
      if (!body) {
        return createErrorResponse(400, 'Missing request body');
      }
      
      const { choreId, childId, date } = JSON.parse(body);
      
      if (!choreId || typeof choreId !== 'string') {
        return createErrorResponse(400, 'ChoreId is required and must be a string');
      }
      
      if (!childId || typeof childId !== 'string') {
        return createErrorResponse(400, 'ChildId is required and must be a string');
      }
      
      if (!date || typeof date !== 'string' || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return createErrorResponse(400, 'Date is required and must be in YYYY-MM-DD format');
      }
      
      // Verify chore exists
      const choreResult = await dynamoDb.get({
        TableName: CHORES_TABLE,
        Key: { id: choreId },
      }).promise();
      
      if (!choreResult.Item) {
        return createErrorResponse(404, 'Chore not found');
      }
      
      // Verify child exists
      const childResult = await dynamoDb.get({
        TableName: CHILDREN_TABLE,
        Key: { id: childId },
      }).promise();
      
      if (!childResult.Item) {
        return createErrorResponse(404, 'Child not found');
      }
      
      const timestamp = new Date().toISOString();
      const record: ChoreRecord = {
        id: uuidv4(),
        choreId,
        childId,
        date,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      await dynamoDb.put({
        TableName: RECORDS_TABLE,
        Item: record,
      }).promise();
      
      return createSuccessResponse(record);
    }
    
    // PUT /records/{id}
    if (httpMethod === 'PUT' && path.match(/^\/records\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing record ID');
      }
      
      if (!body) {
        return createErrorResponse(400, 'Missing request body');
      }
      
      const { choreId, childId, date } = JSON.parse(body);
      
      if (!choreId || typeof choreId !== 'string') {
        return createErrorResponse(400, 'ChoreId is required and must be a string');
      }
      
      if (!childId || typeof childId !== 'string') {
        return createErrorResponse(400, 'ChildId is required and must be a string');
      }
      
      if (!date || typeof date !== 'string' || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return createErrorResponse(400, 'Date is required and must be in YYYY-MM-DD format');
      }
      
      // Verify record exists
      const getResult = await dynamoDb.get({
        TableName: RECORDS_TABLE,
        Key: { id },
      }).promise();
      
      if (!getResult.Item) {
        return createErrorResponse(404, 'Record not found');
      }
      
      // Verify chore exists
      const choreResult = await dynamoDb.get({
        TableName: CHORES_TABLE,
        Key: { id: choreId },
      }).promise();
      
      if (!choreResult.Item) {
        return createErrorResponse(404, 'Chore not found');
      }
      
      // Verify child exists
      const childResult = await dynamoDb.get({
        TableName: CHILDREN_TABLE,
        Key: { id: childId },
      }).promise();
      
      if (!childResult.Item) {
        return createErrorResponse(404, 'Child not found');
      }
      
      const timestamp = new Date().toISOString();
      const updatedRecord: Partial<ChoreRecord> = {
        choreId,
        childId,
        date,
        updatedAt: timestamp,
      };
      
      const updateResult = await dynamoDb.update({
        TableName: RECORDS_TABLE,
        Key: { id },
        UpdateExpression: 'set #choreId = :choreId, #childId = :childId, #date = :date, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#choreId': 'choreId',
          '#childId': 'childId',
          '#date': 'date',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':choreId': updatedRecord.choreId,
          ':childId': updatedRecord.childId,
          ':date': updatedRecord.date,
          ':updatedAt': updatedRecord.updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      }).promise();
      
      return createSuccessResponse(updateResult.Attributes);
    }
    
    // DELETE /records/{id}
    if (httpMethod === 'DELETE' && path.match(/^\/records\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing record ID');
      }
      
      // Check if record exists
      const getResult = await dynamoDb.get({
        TableName: RECORDS_TABLE,
        Key: { id },
      }).promise();
      
      if (!getResult.Item) {
        return createErrorResponse(404, 'Record not found');
      }
      
      await dynamoDb.delete({
        TableName: RECORDS_TABLE,
        Key: { id },
      }).promise();
      
      return createSuccessResponse({ id, deleted: true });
    }
    
    return createErrorResponse(404, 'Route not found');
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};
