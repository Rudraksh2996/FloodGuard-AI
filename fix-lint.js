const fs = require('fs');

function replaceFile(file, regex, replacement) {
    const data = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, data.replace(regex, replacement), 'utf8');
}

replaceFile('app/(marketing)/page.tsx', /ShieldAlert, Droplet, Clock, Activity, Target, Zap, Server, Phone, Info/, 'ShieldAlert, Clock, Activity, Target, Zap, Server, Phone');
replaceFile('components/dashboard/map-inner.tsx', /import { useEffect, useState } from "react";/, 'import { useEffect } from "react";');
replaceFile('components/dashboard/map-inner.tsx', /import { useSimulatorStore } from "@\/store\/simulator-store";/, '');
replaceFile('components/dashboard/map-inner.tsx', /const RecenterAutomatically[\s\S]*?return null;\n}/, '');
replaceFile('components/ui/background-beams.tsx', /import React, { useEffect, useRef } from "react";/, 'import React from "react";');
replaceFile('components/ui/flip-words.tsx', /import { AnimatePresence, motion, LayoutGroup } from "framer-motion";/, 'import { AnimatePresence, motion } from "framer-motion";');
replaceFile('components/ui/flip-words.tsx', /import React, { useCallback, useEffect, useRef, useState } from "react";/, 'import React, { useCallback, useEffect, useState } from "react";');
replaceFile('components/ui/floating-navbar.tsx', /navItems.map\(\(navItem: any, idx: number\)/, 'navItems.map((navItem: { link: string; name: string; icon?: JSX.Element }, idx: number)');
replaceFile('components/ui/tracing-beam.tsx', /useVelocity,/, '');
replaceFile('lib/mock-data.ts', /import { RiskLevel } from ".\/fri";/, '');

console.log("Lint errors fixed");
