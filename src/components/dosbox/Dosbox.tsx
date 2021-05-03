import React, { useRef, useEffect, useCallback, useState } from 'react';
import './Dosbox.css';
import styled from 'styled-components';
import { isNil, isEqual } from 'lodash';
import { Joystick } from 'react-joystick-component';
import { KEY_RETURN } from 'keycode-js';
import { DIRECTION_TYPE } from 'types';
import { DosFactory } from 'js-dos';
import { DosCommandInterface } from 'js-dos/dist/typescript/js-dos-ci';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
require('js-dos'); // eslint-disable-line @typescript-eslint/no-require-imports
const Dos = (window as any).Dos as DosFactory;

declare global {
    interface Window {
        ci: DosCommandInterface,
        fs: any
    }
};

window.ci = window.ci || null;

export default React.memo((props) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [keyCode, setKeyCode] = useState<any>(undefined);
    const [screenWidth, setScreenWidth] = useState(640);
    const [screenHeight, setScreenHeight] = useState(480);
    const MOVE_RANGE:number = 20;

    const handleResize = useCallback(() => {

        if (!isNil(rootRef.current)) {
            const clientRect: DOMRect = rootRef.current?.getBoundingClientRect?.();
        
            if (clientRect.width / 640 > clientRect.height / 480) {
                setScreenWidth(~~(clientRect.height * 640 / 480));
                setScreenHeight(clientRect.height);
            } else {
                setScreenWidth(clientRect.width);
                setScreenHeight(~~(clientRect.width * 480 / 640));
            }
        }
    }, []);

    const toggleFullScreen = useCallback(() => {

        if (('maxTouchPoints' in Navigator)) {
            if (document.fullscreenElement) {
                document.exitFullscreen?.();
            } else {
                document.documentElement.requestFullscreen?.();
            }
        } else {
            window.ci?.fullscreen();
        }
    }, []);

    const saveFile = useCallback(() => {
        window.fs?.fs?.saveFilesToDB?.([process.env.REACT_APP_GAME_SAVE_FILE]);
    }, []);

    const loadFile = useCallback(() => {
        window.fs?.fs?.loadFilesFromDB?.([process.env.REACT_APP_GAME_SAVE_FILE]);
    }, []);

    const handleStop = useCallback((event: IJoystickUpdateEvent) => {
        window.ci?.simulateKeyEvent?.(keyCode, false);
        setKeyCode(null);
    }, [keyCode]);

    const calcDiagonalInput = useCallback((point: number, direction: DIRECTION_TYPE): DIRECTION_TYPE => {
        let returnDirection = direction;

        if (Math.abs(point) > MOVE_RANGE) {

            switch (direction) {
                case DIRECTION_TYPE.FORWARD:
                case DIRECTION_TYPE.BACKWARD:
                        direction = (Math.sign(point) < 0)
                                        ? (isEqual(direction, DIRECTION_TYPE.FORWARD) ? DIRECTION_TYPE.LEFT_FORWARD : DIRECTION_TYPE.LEFT_BACKWARD)
                                        : (isEqual(direction, DIRECTION_TYPE.FORWARD) ? DIRECTION_TYPE.RIGHT_FORWARD : DIRECTION_TYPE.RIGHT_BACKWARD);
                    break;
                case DIRECTION_TYPE.LEFT:
                case DIRECTION_TYPE.RIGHT:
                default:
                        direction = (Math.sign(point) < 0)
                                        ? (isEqual(direction, DIRECTION_TYPE.LEFT) ? DIRECTION_TYPE.LEFT_BACKWARD : DIRECTION_TYPE.RIGHT_BACKWARD)
                                        : (isEqual(direction, DIRECTION_TYPE.LEFT) ? DIRECTION_TYPE.LEFT_FORWARD : DIRECTION_TYPE.RIGHT_FORWARD);
                    break;
            }
        }

        return returnDirection;
    }, []);

    const handleMove = useCallback((event: IJoystickUpdateEvent, isDiagonal: boolean = false) => {
        let direction: number = 0;
        const xPoint: number = ~~(event?.x ?? 0);
        const yPoint: number = ~~(event?.y ?? 0);
        let point: number = xPoint;

        switch (event?.direction) {
            case 'FORWARD':
                direction = DIRECTION_TYPE.FORWARD;
                break;
            case 'BACKWARD':
                direction = DIRECTION_TYPE.BACKWARD;
                break;
            case 'RIGHT':
                direction = DIRECTION_TYPE.RIGHT;
                point = yPoint;
                break;
            case 'LEFT':
            default:
                direction = DIRECTION_TYPE.LEFT;
                point = yPoint;
                break;
        }

        if (isDiagonal) {
            direction = calcDiagonalInput(point, direction);
        }

        if (!isEqual(keyCode, direction)) {

            if (!isNil(keyCode)) {
                window.ci?.simulateKeyEvent?.(keyCode, false);
            }
            window.ci?.simulateKeyEvent?.(direction, true);
            setKeyCode(direction);
        }
    }, [keyCode, calcDiagonalInput]);

    const handleEnter = useCallback(() => {
        window.ci?.simulateKeyPress?.(KEY_RETURN);
    }, []);

    const componentMounted = () => {
        window.addEventListener('resize', handleResize);
        handleResize();

        (async () => {
            try {
                const { main, fs } = await Dos(canvasRef.current as HTMLCanvasElement, {
                    wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox-nosync.js',
                    autolock: true
                });
                window.fs = fs;
                await window.fs?.extract?.(process.env.REACT_APP_GAME_NAME);
                loadFile();
                window.ci = await main(['-c', `${process.env.REACT_APP_GAME_EXEC}`]);
            } catch (error) {
                console.log(error);
            }
        })();

        return () => {
            try {
                saveFile();
            } catch (error) {
                console.log(error);
            } finally {
                window.ci?.exit?.();
            }
        };
    };
    useEffect(componentMounted, [handleResize, saveFile, loadFile]);

    return <>
        <section className="menus">
            <button onClick={() => { toggleFullScreen(); }}>Full Screen</button>
            <button onClick={() => { saveFile(); }}>Save File</button>
            <button onClick={() => { loadFile(); }}>Load File</button>
        </section>
        <DoxboxContainer className="screen-container" screenWidth={screenWidth} screenHeight={screenHeight}>
            <div ref={rootRef} className="canvas-container">
                <canvas ref={canvasRef} />
                <div className="bottons">
                    <div>
                        <Joystick size={100} move={handleMove} stop={handleStop}></Joystick>
                    </div>
                    <div>
                        <button onClick={() => { handleEnter(); }}>Enter</button>
                    </div>
                </div>
            </div>
        </DoxboxContainer>
    </>;
}, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
});

interface ContainerProps {
    screenWidth: number,
    screenHeight: number
};

const DoxboxContainer = styled.div<ContainerProps>`
    canvas {
        width: ${(props: ContainerProps) => props.screenWidth}px;
        height: ${(props: ContainerProps) => props.screenHeight}px;
    }
`;