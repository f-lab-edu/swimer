import { usePathname } from "next/navigation";

export function usePath(){
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    return id;
}