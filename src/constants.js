/**
 * This module exports the application level constants
 * defined either here or in .env fil
 */
export const  {
	VALID_ACTIVE_CONNECTIONS,
} = process.env;

export const DEFAULT_METRICS = {
	LOG_METRICS: 'LogMetrics',
	PROCESS_METRICS: 'ProcessMetrics',
	CPU_METRICS: 'CPUMetrics',
	MEMORY_METRICS: 'MemoryMetrics',
};