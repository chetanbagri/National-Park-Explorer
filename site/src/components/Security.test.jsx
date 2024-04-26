import React from 'react';
import { render } from '@testing-library/react';
import IdleLogout from './Security';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';

jest.mock('react-idle-timer');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('IdleLogout Component', () => {
    test('calls navigate to /login on idle', async () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
        const removeItemSpy = jest.spyOn(window.sessionStorage.__proto__, 'removeItem');

        render(<IdleLogout />);
        const idleCallback = useIdleTimer.mock.calls[0][0].onIdle;
        await idleCallback();

        expect(removeItemSpy).toHaveBeenCalledWith('userInfo');
        expect(navigateMock).toHaveBeenCalledWith('/login');

        removeItemSpy.mockRestore();
    });
});
