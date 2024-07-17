import {useState, useEffect} from 'react';
import {PublicSwimmingPool} from '@/lib/types';

const useData = () => {
  const [data, setData] = useState<PublicSwimmingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const imageSources = [
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAxMDhfMTU0%2FMDAxNzA0NzAyNzAzODUx.ts8TNgrP_VnFg_Te_tnZfbjfpFRUMNpI225smrVt0hkg.EgkYA7N0JvnyH89FT1d8WE200KPbTBaiXvw2G4Z69sAg.JPEG.jcline77%2FScreenshot%25A3%25DF20240108%25A3%25DF172840%25A3%25DFNAVER.jpg&type=sc960_832',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAzMzFfMTMw%2FMDAxNzExODU3Nzg0ODgy.7nJOf3Fhe4jEHl7W2FrQb-jrVXnGuf5SWSEAnKrbp3wg.CbxjgFETe3wq7WjaIhfu5KOxleIZ_ut7K7N6jorDHlMg.PNG%2FIMG_8449.PNG&type=sc960_832',
    'https://www.hanamsport.or.kr/wwwroot/ms/img/swimming_pool_01.jpg',
    'https://www.osansports.or.kr/File/Download/c30ead8a7b80c447cf8b9b8ba81ef2f6',
    'https://www.osansports.or.kr/File/Download/cd20a4f6aa0632680a8cf04abe424ef2',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const requestType = 'Type=json';
      const requestKey = 'KEY=9e860bd7d3ee4d129d3390efe28a172a';
      const requestUrl =
        'https://openapi.gg.go.kr/PublicSwimmingPool?' +
        requestKey +
        '&' +
        requestType;
      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error('응답 받기 실패');
        }
        const responseData = await response.json();
        const dataArray: PublicSwimmingPool[] =
          responseData.PublicSwimmingPool[1].row;

        dataArray.forEach((item, index) => {
          item.swimmingPoolId = index.toString();
          item.imgSource = imageSources[index % imageSources.length];
        });

        setData(dataArray);
      } catch (error) {
        console.error('fetching data 에러', error);
        setError('데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {data, loading, error};
};

export default useData;
