import axios from 'axios';
import { check, errorHandler } from '../../errors';
import { BaseResponse } from '../../types/api-types';
import { CleanerType } from '../../types/cleaner-types';
import { parseRateLimitingResponse } from '../../utils/api-utils';

export default <T, K extends BaseResponse> (
  basePath: string,
  apiKey: string,
  params: T,
  type: CleanerType,
) => new Promise<K>((resolve, reject) => {
  check(params, basePath, apiKey, null, 'cleaner').then(() => {
    const headers = {
      'Accept-Encoding': 'gzip',
    };

    axios.get<K>(`${basePath}/${type}/clean`, {
      params: {
        api_key: apiKey,
        ...params,
      },
      headers,
    })
      .then((response) => {
        if (response?.data?.status === 200) {
          resolve(parseRateLimitingResponse(response));
        }
      })
      .catch((error) => {
        reject(errorHandler(error));
      });
  }).catch((error) => {
    reject(error.message);
  });
});
