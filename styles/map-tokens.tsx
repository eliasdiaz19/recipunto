"use client";

// Map tokens centralizados para tamaños, colores, sombras y z-index.
// Evitamos hex en componentes, importando desde aquí.

export type BoxStatus = "empty" | "partial" | "full" | "ready" | "pending";

export const mapTokens = {
	marker: {
		size: {
			outerDiameterPx: 44,
			innerIconPx: 20,
			badgePx: 18,
		},
		shadow: {
			soft: "0 6px 14px rgba(0,0,0,0.15)",
			lift: "0 10px 20px rgba(0,0,0,0.20)",
		},
		zIndex: {
			default: 400,
			hover: 401,
			active: 402,
		},
		colors: {
			status: {
				empty: "#9CA3AF", // gray-400
				partial: "#F59E0B", // amber-500
				full: "#EF4444", // red-500
				ready: "#28A745", // green custom
				pending: "#6B7280", // gray-500 (used with opacity)
			},
			progressBg: "#1118271A", // slate-900 @ 10%
			progressFg: "#111827", // slate-900
		},
	},
	cluster: {
		sizePx: 44,
		shadow: "0 6px 14px rgba(0,0,0,0.12)",
	},
	controls: {
		zIndex: 500,
	},
} as const;

export const materialColorTokens: Record<string, string> = {
	glass: "#60A5FA", // blue-400
	plastic: "#34D399", // emerald-400
	metal: "#F472B6", // pink-400
	paper: "#FBBF24", // amber-400
	organic: "#A3E635", // lime-400
	other: "#94A3B8", // slate-400
};

// Proveedor ligero que inyecta variables CSS para Tailwind (var(--token)).
// Útil para ajustar tema y permitir clases Tailwind con valores var(...).
type MapThemeProviderProps = {
	children: React.ReactNode;
	styleOverride?: React.CSSProperties;
};

export function MapThemeProvider({ children, styleOverride }: MapThemeProviderProps) {
	const style: React.CSSProperties = {
		// Marker sizes
		"--map-marker-size": `${mapTokens.marker.size.outerDiameterPx}px`,
		"--map-marker-icon": `${mapTokens.marker.size.innerIconPx}px`,
		"--map-marker-badge": `${mapTokens.marker.size.badgePx}px`,
		// Colors
		"--map-status-empty": mapTokens.marker.colors.status.empty,
		"--map-status-partial": mapTokens.marker.colors.status.partial,
		"--map-status-full": mapTokens.marker.colors.status.full,
		"--map-status-ready": mapTokens.marker.colors.status.ready,
		"--map-status-pending": mapTokens.marker.colors.status.pending,
		"--map-progress-bg": mapTokens.marker.colors.progressBg,
		"--map-progress-fg": mapTokens.marker.colors.progressFg,
		// Cluster
		"--map-cluster-size": `${mapTokens.cluster.sizePx}px`,
		// Shadows
		"--map-shadow-soft": mapTokens.marker.shadow.soft,
		"--map-shadow-lift": mapTokens.marker.shadow.lift,
		// z-index
		"--map-z-controls": mapTokens.controls.zIndex.toString(),
		...styleOverride,
	} as React.CSSProperties;

	return (
		<div style={style}>{children}</div>
	);
}

export function getStatusColor(status: BoxStatus): string {
	return mapTokens.marker.colors.status[status === "pending" ? "pending" : status];
}

export function clampFillPercent(value: number): number {
	if (Number.isNaN(value)) return 0;
	if (value < 0) return 0;
	if (value > 100) return 100;
	return Math.round(value);
}


