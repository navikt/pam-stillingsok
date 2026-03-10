import process from "node:process";
import { monitorEventLoopDelay } from "node:perf_hooks";

type RuntimeMetrics = Readonly<{
    kind: "runtime-metrics";
    pid: number;
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
    externalMb: number;
    arrayBuffersMb: number;
    cpuUserMicros: number;
    cpuSystemMicros: number;
    eventLoopDelayP95Ms: number;
    uptimeSec: number;
}>;

type RuntimeMetricsLogger = (metrics: RuntimeMetrics) => void;

declare global {
    var __runtimeMetricsStarted__: boolean | undefined;
}

const toMegabytes = (bytes: number): number => {
    return Number((bytes / 1024 / 1024).toFixed(1));
};

const toMillisecondsFromNanoseconds = (nanoseconds: number): number => {
    return Number((nanoseconds / 1_000_000).toFixed(1));
};

export const startRuntimeMetrics = (log: RuntimeMetricsLogger): void => {
    if (globalThis.__runtimeMetricsStarted__ === true) {
        return;
    }

    globalThis.__runtimeMetricsStarted__ = true;

    const eventLoopDelayHistogram = monitorEventLoopDelay({ resolution: 20 });
    eventLoopDelayHistogram.enable();

    let previousCpuUsage = process.cpuUsage();

    const interval = setInterval(() => {
        const memoryUsage = process.memoryUsage();
        const cpuUsageDelta = process.cpuUsage(previousCpuUsage);
        previousCpuUsage = process.cpuUsage();

        const metrics: RuntimeMetrics = {
            kind: "runtime-metrics",
            pid: process.pid,
            rssMb: toMegabytes(memoryUsage.rss),
            heapUsedMb: toMegabytes(memoryUsage.heapUsed),
            heapTotalMb: toMegabytes(memoryUsage.heapTotal),
            externalMb: toMegabytes(memoryUsage.external),
            arrayBuffersMb: toMegabytes(memoryUsage.arrayBuffers),
            cpuUserMicros: cpuUsageDelta.user,
            cpuSystemMicros: cpuUsageDelta.system,
            eventLoopDelayP95Ms: toMillisecondsFromNanoseconds(eventLoopDelayHistogram.percentile(95)),
            uptimeSec: Number(process.uptime().toFixed(1)),
        };

        log(metrics);
        eventLoopDelayHistogram.reset();
    }, 60_000);

    interval.unref();
};
