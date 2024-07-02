import { useState, useEffect } from 'react';

interface PublicSwimmingPool {
  id: string;
  FACLT_NM: string;
  SIGUN_NM: string;
  CONTCT_NO: string;
  HMPG_ADDR: string;
  IRREGULR_RELYSWIMPL_LENG: string;
  IRREGULR_RELYSWIMPL_LANE_CNT: string;
  [key: string]: string;
}

const useData = () => {
    const [data, setData] = useState<PublicSwimmingPool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const requestType = "Type=json";
            const requestKey = "KEY=9e860bd7d3ee4d129d3390efe28a172a";
            const requestUrl = "https://openapi.gg.go.kr/PublicSwimmingPool?" + requestKey + "&" + requestType;
            try{
                const response = await fetch(requestUrl);
                if (!response.ok) {
                    throw new Error("응답 받기 실패");
                }
                const responseData = await response.json();
                const dataArray: PublicSwimmingPool[] = responseData.PublicSwimmingPool[1].row;
                
                dataArray.forEach((item, index) => {
                    item.id = index.toString();
                });

                setData(dataArray);

            }catch(error){
                console.error("fetching data 에러", error);
                setError("데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
            }finally{
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error };
};

export default useData;
