import Script from 'next/script';
import {useEffect} from 'react';
import {Map} from 'react-kakao-maps-sdk';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false`;

const KakaoMap = () => {
  useEffect(() => {
    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {});
    };

    if (window.kakao) {
      loadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.onload = loadKakaoMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      <Map
        center={{lat: 33.450701, lng: 126.570667}}
        style={{width: '100%', height: '400px'}}
      />
    </>
  );
};

export default KakaoMap;
