// Bed mapping for soil sensor nodes
// Based on current active nodes:
// !04c5ad60 = soil2 A → Orchard/Sadovnjak
// !76208ba5 = soil3 B → Garden/Vrt
// !1641e779 = old Sensor A (now PAX counter tester node - inactive for soil)
export const BED_MAPPING = {
    // Orchard/Sadovnjak (soil2 A - !04c5ad60)
    '!04c5ad60-0': { name: 'bedOrchard1', color: 'var(--primary)' },
    '!04c5ad60-1': { name: 'bedOrchard2', color: 'var(--text-sage)' },
    
    // Garden/Vrt (soil3 B - !76208ba5)
    '!76208ba5-0': { name: 'bedGarden1', color: 'var(--primary-dark)' },
    '!76208ba5-1': { name: 'bedGarden2', color: 'var(--border-color)' },
    
    // Legacy/inactive beds (kept for historical data compatibility)
    '!1641e779-0': { name: 'bedTravnatiSestoj', color: 'var(--primary)' },
    '!1641e779-1': { name: 'bedSivkaInMelisa', color: 'var(--text-sage)' },
};

// PAX counter nodes (current: !1641e779 tester, future: !c467c5cc gnezdo)
export const PAX_COUNTER_NODES = {
    TESTER: '!1641e779',
    GNEZDO: '!c467c5cc',
};