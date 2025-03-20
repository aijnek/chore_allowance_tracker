import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Allowance, Child, Chore, ChoreRecord } from '../types';
import { 
  createErrorResponse, 
  createSuccessResponse, 
  dynamoDb, 
  CHORES_TABLE, 
  RECORDS_TABLE, 
  CHILDREN_TABLE,
  getMonthYearFromDate,
  getStartAndEndOfMonth
} from '../utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, queryStringParameters } = event;
    
    // GET /allowances
    if (httpMethod === 'GET' && path === '/allowances') {
      // Get query parameters
      const month = queryStringParameters?.month;
      const yearStr = queryStringParameters?.year;
      
      if (!month || !yearStr) {
        return createErrorResponse(400, 'Month and year query parameters are required');
      }
      
      const year = parseInt(yearStr, 10);
      
      if (isNaN(year)) {
        return createErrorResponse(400, 'Year must be a valid number');
      }
      
      // Get date range for the specified month and year
      const { start, end } = getStartAndEndOfMonth(month, year);
      
      // Get all children
      const childrenResult = await dynamoDb.scan({
        TableName: CHILDREN_TABLE,
      }).promise();
      
      const children = childrenResult.Items as Child[];
      
      if (!children || children.length === 0) {
        return createSuccessResponse([]);
      }
      
      // Get all chores
      const choresResult = await dynamoDb.scan({
        TableName: CHORES_TABLE,
      }).promise();
      
      const chores = choresResult.Items as Chore[];
      
      if (!chores || chores.length === 0) {
        return createSuccessResponse([]);
      }
      
      // Create a map of chore IDs to chores for easy lookup
      const choreMap = new Map<string, Chore>();
      chores.forEach(chore => {
        choreMap.set(chore.id, chore);
      });
      
      // Get all records for the specified month
      const recordsResult = await dynamoDb.scan({
        TableName: RECORDS_TABLE,
        FilterExpression: '#date BETWEEN :start AND :end',
        ExpressionAttributeNames: {
          '#date': 'date',
        },
        ExpressionAttributeValues: {
          ':start': start,
          ':end': end,
        },
      }).promise();
      
      const records = recordsResult.Items as ChoreRecord[];
      
      // Calculate allowances for each child
      const allowances: Allowance[] = children.map(child => {
        // Filter records for this child
        const childRecords = records.filter(record => record.childId === child.id);
        
        // Group records by chore
        const choreRecordMap = new Map<string, ChoreRecord[]>();
        childRecords.forEach(record => {
          if (!choreRecordMap.has(record.choreId)) {
            choreRecordMap.set(record.choreId, []);
          }
          choreRecordMap.get(record.choreId)?.push(record);
        });
        
        // Calculate allowance details
        const recordDetails = Array.from(choreRecordMap.entries()).map(([choreId, records]) => {
          const chore = choreMap.get(choreId);
          
          if (!chore) {
            return {
              choreId,
              choreName: 'Unknown Chore',
              price: 0,
              count: records.length,
              subtotal: 0,
            };
          }
          
          return {
            choreId,
            choreName: chore.name,
            price: chore.price,
            count: records.length,
            subtotal: chore.price * records.length,
          };
        });
        
        // Calculate total allowance amount
        const totalAmount = recordDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
        
        return {
          childId: child.id,
          childName: child.name,
          month,
          year,
          amount: totalAmount,
          records: recordDetails,
        };
      });
      
      return createSuccessResponse(allowances);
    }
    
    return createErrorResponse(404, 'Route not found');
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};
