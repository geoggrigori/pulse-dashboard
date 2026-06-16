/** A fixed-capacity FIFO buffer — keeps only the most recent `capacity` items. */
export class RingBuffer<T> {
  private buf: T[] = []

  constructor(private readonly capacity: number) {
    if (capacity <= 0) throw new Error('capacity must be positive')
  }

  push(item: T): void {
    this.buf.push(item)
    if (this.buf.length > this.capacity) this.buf.shift()
  }

  toArray(): T[] {
    return [...this.buf]
  }

  get size(): number {
    return this.buf.length
  }

  get last(): T | undefined {
    return this.buf[this.buf.length - 1]
  }
}
