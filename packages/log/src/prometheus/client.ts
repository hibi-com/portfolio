import {
    Counter,
    type CounterConfiguration,
    collectDefaultMetrics,
    Gauge,
    type GaugeConfiguration,
    Histogram,
    type HistogramConfiguration,
    Registry,
    Summary,
    type SummaryConfiguration,
} from "prom-client";

export class PrometheusClient {
    private readonly registry: Registry;
    private readonly counters: Map<string, Counter> = new Map();
    private readonly gauges: Map<string, Gauge> = new Map();
    private readonly histograms: Map<string, Histogram> = new Map();
    private readonly summaries: Map<string, Summary> = new Map();

    constructor(registry?: Registry) {
        this.registry = registry ?? new Registry();
    }

    collectDefaultMetrics(): void {
        collectDefaultMetrics({ register: this.registry });
    }

    createCounter(config: CounterConfiguration<string>): Counter<string> {
        const existing = this.counters.get(config.name);
        if (existing) {
            return existing;
        }

        const counter = new Counter({
            ...config,
            registers: [this.registry],
        });
        this.counters.set(config.name, counter);
        return counter;
    }

    createGauge(config: GaugeConfiguration<string>): Gauge<string> {
        const existing = this.gauges.get(config.name);
        if (existing) {
            return existing;
        }

        const gauge = new Gauge({
            ...config,
            registers: [this.registry],
        });
        this.gauges.set(config.name, gauge);
        return gauge;
    }

    createHistogram(config: HistogramConfiguration<string>): Histogram<string> {
        const existing = this.histograms.get(config.name);
        if (existing) {
            return existing;
        }

        const histogram = new Histogram({
            ...config,
            registers: [this.registry],
        });
        this.histograms.set(config.name, histogram);
        return histogram;
    }

    createSummary(config: SummaryConfiguration<string>): Summary<string> {
        const existing = this.summaries.get(config.name);
        if (existing) {
            return existing;
        }

        const summary = new Summary({
            ...config,
            registers: [this.registry],
        });
        this.summaries.set(config.name, summary);
        return summary;
    }

    getCounter(name: string): Counter<string> | undefined {
        return this.counters.get(name);
    }

    getGauge(name: string): Gauge<string> | undefined {
        return this.gauges.get(name);
    }

    getHistogram(name: string): Histogram<string> | undefined {
        return this.histograms.get(name);
    }

    getSummary(name: string): Summary<string> | undefined {
        return this.summaries.get(name);
    }

    async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    getRegistry(): Registry {
        return this.registry;
    }

    reset(): void {
        this.registry.resetMetrics();
    }

    clear(): void {
        this.counters.clear();
        this.gauges.clear();
        this.histograms.clear();
        this.summaries.clear();
        this.registry.clear();
    }
}
