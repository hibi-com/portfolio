import type { FreeePartnerRecord } from "./types.js";

class PartnersStore {
    private readonly store = new Map<number, FreeePartnerRecord>();
    private nextId = 1000;

    getAll(companyId: number, limit = 100): FreeePartnerRecord[] {
        const list = Array.from(this.store.values()).filter((p) => p.company_id === companyId);
        return list.slice(0, limit);
    }

    getById(id: number): FreeePartnerRecord | undefined {
        return this.store.get(id);
    }

    create(record: Omit<FreeePartnerRecord, "id">): FreeePartnerRecord {
        const id = this.nextId++;
        const newRecord: FreeePartnerRecord = { id, ...record };
        this.store.set(id, newRecord);
        return newRecord;
    }

    update(id: number, data: Partial<FreeePartnerRecord>): FreeePartnerRecord | undefined {
        const existing = this.store.get(id);
        if (!existing) return undefined;

        const updated: FreeePartnerRecord = { ...existing, ...data, id };
        this.store.set(id, updated);
        return updated;
    }

    delete(id: number): boolean {
        return this.store.delete(id);
    }

    clear(): void {
        this.store.clear();
        this.nextId = 1000;
    }
}

export const partnersStore = new PartnersStore();
