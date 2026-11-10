/** "01", "02"… — sections are numbered by position, so optional sections don't leave gaps. */
export const sectionNumber = (n: number) => String(n).padStart(2, '0')
