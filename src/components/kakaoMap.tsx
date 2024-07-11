import Script from 'next/script';
import {useEffect, useState} from 'react';
import {Map, MapMarker} from 'react-kakao-maps-sdk';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;

const KakaoMap = () => {
  const [address, setAddress] = useState({lat: 0, lng: 0});
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
    if (kakaoLoaded) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        '경기 하남시 아리수로 600',
        function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            setAddress({lat, lng});
          } else {
            console.error('Failed to convert address to coordinates:', status);
          }
        },
      );
    }
  }, [kakaoLoaded]);

  return (
    <>
      <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      <Map
        center={{lat: address.lat, lng: address.lng}}
        style={{width: '100%', height: '400px'}}
      >
        <MapMarker position={address}></MapMarker>
      </Map>
    </>
  );
};

export default KakaoMap;
