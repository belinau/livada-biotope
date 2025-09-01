import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function Page({ title, children }) {
    useEffect(() => { document.title = `${title} | Biotop Livada`; }, [title]);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}

export default Page;