export class SharedResourcePool<T extends { dispose(): void }> {
  private entries = new Map<string, { resource: T; references: number }>();

  acquire(key: string, create: () => T) {
    let entry = this.entries.get(key);
    if (!entry) {
      entry = { resource: create(), references: 0 };
      this.entries.set(key, entry);
    }
    entry.references++;
    let released = false;
    return {
      resource: entry.resource,
      release: () => {
        if (released) return;
        released = true;
        entry.references--;
        queueMicrotask(() => {
          if (entry.references === 0 && this.entries.get(key) === entry) {
            this.entries.delete(key);
            entry.resource.dispose();
          }
        });
      },
    };
  }

  dispose() {
    this.entries.forEach((entry) => entry.resource.dispose());
    this.entries.clear();
  }

  get size() { return this.entries.size; }
}

export function tabletGraphicsDefault(touchPoints: number, coarsePointer: boolean) {
  return touchPoints > 1 || coarsePointer;
}
