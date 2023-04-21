import alfy from 'alfy';
import { TodoistApi } from '@doist/todoist-api-typescript';

const add = async (todo: string) => {
  const api_key = process.env.apikey!;
  const api = new TodoistApi(api_key);

  try {
    const result = await api.addTask({ content: todo });
    console.log(result.content);
  } catch (e: any) {
    console.log('Error: Unexpected error occurred: ', e.message);
  }
};

add(alfy.input);
