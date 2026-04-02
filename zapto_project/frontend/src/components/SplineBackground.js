import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden opacity-60 md:opacity-80 pointer-events-none">
            <div className="absolute inset-0 bg-black -z-20"></div>
            <Suspense fallback={
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <div className="w-full h-full optimize-gpu" style={{ contain: 'strict', touchAction: 'pan-y', pointerEvents: 'none' }}>
                    <Spline
                        scene="https://prod.spline.design/W14rKqOCv-ujjO2H/scene.splinecode"
                        className="w-full h-full"
                        style={{ pointerEvents: 'none', touchAction: 'pan-y' }}
                    />
                </div>
            </Suspense>

            {/* Ambient Overlay to blend with Monolith theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        </div>
    );
};

export default SplineBackground;
