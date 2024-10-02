export interface PublicSwimmingPool {
  swimmingPoolId: string;
  FACLT_NM: string;
  CONTCT_NO: string;
  REFINE_LOTNO_ADDR: string;
  REGULR_RELYSWIMPL_LENG: string;
  REGULR_RELYSWIMPL_LANE_CNT: string;
  imgSource: string;
  [key: string]: string;
}

export interface ReviewData {
  author_user_id: string;
  author_user_name: string;
  reg_date: string;
  review_content: string;
  review_id: string;
  swimmingpool_id: string;
}

export interface TotalData {
  reg_date: string;
  swimmingpool_id: string;
  swimmingpool_name: string;
  author_user_id: string;
  author_user_name: string;
  review_content: string;
  review_id: string;
  swimmingpool_address: string;
}
