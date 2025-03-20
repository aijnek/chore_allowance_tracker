import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { Chore } from '../types';
import { createErrorResponse, createSuccessResponse, dynamoDb, CHORES_TABLE } from '../utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, pathParameters, body } = event;
    
    // GET /chores
    if (httpMethod === 'GET' && path === '/chores') {
      const result = await dynamoDb.scan({
        TableName: CHORES_TABLE,
      }).promise();
      
      return createSuccessResponse(result.Items);
    }
    
    // GET /chores/{id}
    if (httpMethod === 'GET' && path.match(/^\/chores\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing chore ID');
      }
      
      const result = await dynamoDb.get({
        TableName: CHORES_TABLE,
        Key: { id },
      }).promise();
      
      if (!result.Item) {
        return createErrorResponse(404, 'Chore not found');
      }
      
      return createSuccessResponse(result.Item);
    }
    
    // POST /chores
    if (httpMethod === 'POST' && path === '/chores') {
      if (!body) {
        return createErrorResponse(400, 'Missing request body');
      }
      
      const { name, price } = JSON.parse(body);
      
      if (!name || typeof name !== 'string') {
        return createErrorResponse(400, 'Name is required and must be a string');
      }
      
      if (!price || typeof price !== 'number' || price <= 0) {
        return createErrorResponse(400, 'Price is required and must be a positive number');
      }
      
      const timestamp = new Date().toISOString();
      const chore: Chore = {
        id: uuidv4(),
        name,
        price,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      await dynamoDb.put({
        TableName: CHORES_TABLE,
        Item: chore,
      }).promise();
      
      return createSuccessResponse(chore);
    }
    
    // PUT /chores/{id}
    if (httpMethod === 'PUT' && path.match(/^\/chores\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing chore ID');
      }
      
      if (!body) {
        return createErrorResponse(400, 'Missing request body');
      }
      
      const { name, price } = JSON.parse(body);
      
      if (!name || typeof name !== 'string') {
        return createErrorResponse(400, 'Name is required and must be a string');
      }
      
      if (!price || typeof price !== 'number' || price <= 0) {
        return createErrorResponse(400, 'Price is required and must be a positive number');
      }
      
      // Check if chore exists
      const getResult = await dynamoDb.get({
        TableName: CHORES_TABLE,
        Key: { id },
      }).promise();
      
      if (!getResult.Item) {
        return createErrorResponse(404, 'Chore not found');
      }
      
      const timestamp = new Date().toISOString();
      const updatedChore: Partial<Chore> = {
        name,
        price,
        updatedAt: timestamp,
      };
      
      const updateResult = await dynamoDb.update({
        TableName: CHORES_TABLE,
        Key: { id },
        UpdateExpression: 'set #name = :name, #price = :price, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#price': 'price',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':name': updatedChore.name,
          ':price': updatedChore.price,
          ':updatedAt': updatedChore.updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      }).promise();
      
      return createSuccessResponse(updateResult.Attributes);
    }
    
    // DELETE /chores/{id}
    if (httpMethod === 'DELETE' && path.match(/^\/chores\/[a-zA-Z0-9-]+$/)) {
      const id = pathParameters?.id;
      
      if (!id) {
        return createErrorResponse(400, 'Missing chore ID');
      }
      
      // Check if chore exists
      const getResult = await dynamoDb.get({
        TableName: CHORES_TABLE,
        Key: { id },
      }).promise();
      
      if (!getResult.Item) {
        return createErrorResponse(404, 'Chore not found');
      }
      
      await dynamoDb.delete({
        TableName: CHORES_TABLE,
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
