import React from 'react';
import { GlassSection } from '../ui/GlassSection';

function Section({ title, children, className = '' }) {
    return (
        <section className={`container mx-auto px-4 py-12 ${className}`}>
            <h2 className="text-display text-3xl mb-8 text-center text-primary">{title}</h2>
            <div className="relative z-10">
                <GlassSection>
                    {children}
                </GlassSection>
            </div>
        </section>
    );
}

export default Section;