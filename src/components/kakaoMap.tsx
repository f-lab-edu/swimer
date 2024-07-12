import Script from 'next/script';
import {useEffect, useState} from 'react';
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import {TotalData} from '@/lib/types';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;

const KakaoMap = ({reviews}: {reviews: TotalData[]}) => {
  const [address, setAddress] = useState<{lat: number; lng: number}[]>([]);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        setKakaoLoaded(true);
      });
    };

    if (window.kakao && window.kakao.maps && !kakaoLoaded) {
      loadKakaoMap();
    } else if (!window.kakao) {
      const script = document.createElement('script');
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.onload = loadKakaoMap;
      document.head.appendChild(script);
    }
  }, [kakaoLoaded]);

  useEffect(() => {
    if (kakaoLoaded && reviews.length > 0) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const newMarkers: {lat: number; lng: number}[] = [];

      Promise.all(
        reviews.map(review => {
          return new Promise<void>(resolve => {
            const swimmingpoolAddress = review.swimmingpool_address;
            geocoder.addressSearch(swimmingpoolAddress, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const lat = parseFloat(result[0].y);
                const lng = parseFloat(result[0].x);
                newMarkers.push({lat, lng});
              } else {
                console.error(
                  'Failed to convert address to coordinates:',
                  status,
                );
              }
              resolve();
            });
          });
        }),
      ).then(() => {
        setAddress(newMarkers);
      });
    }
  }, [kakaoLoaded, reviews]);

  return (
    <>
      <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      {kakaoLoaded ? (
        <Map
          center={{
            lat: 37.41511561880415,
            lng: 127.24369245377136,
          }}
          style={{width: '100%', height: '400px'}}
          level={11}
        >
          {address.map((address, index) => (
            <MapMarker key={index} position={address} />
          ))}
        </Map>
      ) : (
        <p>지도 준비중...</p>
      )}
    </>
  );
};

export default KakaoMap;
