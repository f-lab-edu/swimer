import Header from './header';
import Footer from './footer';

export default function Layout({children}: {children: React.ReactNode;}) {
    return (
        <>
            <Header children={children}/>
            <h1>기본 레이아웃</h1>
            <div>{children}</div>
            <Footer children={children}></Footer>
        </>
    )
}