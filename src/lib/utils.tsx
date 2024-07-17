import {usePathname} from 'next/navigation';

export function usePath() {
  const pathname = usePathname();
  const swimmingPoolId = pathname.split('/').pop() || '';

  return swimmingPoolId;
}
