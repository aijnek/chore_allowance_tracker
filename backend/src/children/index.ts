import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { Child } from '../types';
import { createErrorResponse, createSuccessResponse, dynamoDb, CHILDREN_TABLE } from '../utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, pathParameters, body } = event;
    
    // GET /children
    if (httpMethod === 'GET' && path === '/children') {
      const result = await dynamoDb.scan({
        TableName: CHILDREN_TABLE,
      }).promise();
      
      return createSuccessResponse(result.Items);
    }
    
    // GET /children/{id}
    if (httpMethod === 'GET' && path.match(/^\/children\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing child ID');
      }
      
      const result = await dynamoDb.get({
        TableName: CHILDREN_TABLE,
        Key: { id },
      }).promise();
      
      if (!result.Item) {
        return createErrorResponse(404, 'Child not found');
      }
      
      return createSuccessResponse(result.Item);
    }
    
    // POST /children
    if (httpMethod === 'POST' && path === '/children') {
      if (!body) {
        return createErrorResponse(400, 'Missing request body');
      }
      
      const { name } = JSON.parse(body);
      
      if (!name || typeof name !== 'string') {
        return createErrorResponse(400, 'Name is required and must be a string');
      }
      
      const timestamp = new Date().toISOString();
      const child: Child = {
        id: uuidv4(),
        name,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      await dynamoDb.put({
        TableName: CHILDREN_TABLE,
        Item: child,
      }).promise();
      
      return createSuccessResponse(child);
    }
    
    // PUT /children/{id}
    if (httpMethod === 'PUT' && path.match(/^\/children\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing child ID');
      }
      
      if (!body) {
        return createErrorResponse(400, 'Missing request body');
      }
      
      const { name } = JSON.parse(body);
      
      if (!name || typeof name !== 'string') {
        return createErrorResponse(400, 'Name is required and must be a string');
      }
      
      // Check if child exists
      const getResult = await dynamoDb.get({
        TableName: CHILDREN_TABLE,
        Key: { id },
      }).promise();
      
      if (!getResult.Item) {
        return createErrorResponse(404, 'Child not found');
      }
      
      const timestamp = new Date().toISOString();
      const updatedChild: Partial<Child> = {
        name,
        updatedAt: timestamp,
      };
      
      const updateResult = await dynamoDb.update({
        TableName: CHILDREN_TABLE,
        Key: { id },
        UpdateExpression: 'set #name = :name, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':name': updatedChild.name,
          ':updatedAt': updatedChild.updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      }).promise();
      
      return createSuccessResponse(updateResult.Attributes);
    }
    
    // DELETE /children/{id}
    if (httpMethod === 'DELETE' && path.match(/^\/children\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing child ID');
      }
      
      // Check if child exists
      const getResult = await dynamoDb.get({
        TableName: CHILDREN_TABLE,
        Key: { id },
      }).promise();
      
      if (!getResult.Item) {
        return createErrorResponse(404, 'Child not found');
      }
      
      await dynamoDb.delete({
        TableName: CHILDREN_TABLE,
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
