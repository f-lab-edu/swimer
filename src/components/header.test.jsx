import React from 'react';
import Header from './header'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';

test("1. 로그인 정보가 있을 경우(user) 사용자 이름이 표시 되는 지 확인", () => {
    render(<Header />)

    const userNameElement = screen.getByTestId('testid');
    expect(userNameElement).toBeInTheDocument();
})