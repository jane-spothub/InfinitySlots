import {useRef, useEffect, type FC, type Dispatch, type SetStateAction} from "react";
import {reelsCount, symbols, symbolsPerReel, symbolAssets} from "../Hooks/symbolsImages.ts";
import {usePreloadedSymbols} from "../Hooks/symbols loader.ts";
import {useCanvasDrawing} from "../Hooks/useCanvasDrawing.ts";

interface SlotProps {
    spinTrigger: boolean;
    betAmount:number;
    OnSetAmountWon:Dispatch<SetStateAction<number>>;
}

export const SlotsCanvas: FC<SlotProps> = ({
                                               spinTrigger,
                                               betAmount,
                                               OnSetAmountWon
                                           }) => {
    const slotRef = useRef<HTMLCanvasElement | null>(null);
    const canvasWidth = 700;
    const canvasHeight = 700;
    const MAX_FORWARD_SPEED = 50;
    const loadedSymbolImages = usePreloadedSymbols(symbolAssets);
    const symbolKeys = Object.keys(symbols);
    const getRandomSymbol = () =>
        symbolKeys[Math.floor(Math.random() * symbolKeys.length)];

    const {
        ctxRef,
        spinReels,
        drawSymbol,
        drawColumnSeparators,
        drawCanvasBorder,
        drawGradientBackground
    } = useCanvasDrawing({
        canvasWidth,
        canvasHeight,
        loadedSymbolImages,
        MAX_FORWARD_SPEED,
        getRandomSymbol,
        spinTrigger,
        betAmount,
        OnSetAmountWon
    });

    useEffect(() => {
        const canvas = slotRef.current;
        if (!canvas) return;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctxRef.current = ctx;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            if (ctx) {
                ctxRef.current = ctx;
                drawGradientBackground(ctx);
                drawCanvasBorder(ctx);
                drawColumnSeparators(ctx);

                const symbolWidth = canvasWidth / reelsCount;
                const symbolHeight = canvasHeight / symbolsPerReel;
                const initialSymbols: string[][] = Array.from({ length: reelsCount }, () =>
                    Array.from({ length: symbolsPerReel }, () => getRandomSymbol())
                );
                for (let r = 0; r < reelsCount; r++) {
                    for (let s = 0; s < symbolsPerReel; s++) {
                        const x = r * symbolWidth + symbolWidth / 2;
                        const y = s * symbolHeight + symbolHeight / 2;
                        const symbol = initialSymbols?.[r]?.[s] ?? "Lion";
                        drawSymbol(symbol, x, y, loadedSymbolImages, false, 1);
                    }
                }
            }
        }
    }, [ctxRef, drawCanvasBorder, drawColumnSeparators, drawGradientBackground, drawSymbol, getRandomSymbol, loadedSymbolImages]);

    useEffect(() => {
        if (spinTrigger) {
            spinReels();
        }
    },[spinReels, spinTrigger])

    return (
        <canvas
            ref={slotRef}
            className="slots-canvas"
            width={canvasWidth}
            height={canvasHeight}
        />
    );
};
