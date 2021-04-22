export function convertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / 3600) // conversão de segundos em horas
  const minutes = Math.floor((duration % 3600) / 60) // conversão de segundos em minutos
  const seconds = duration % 60 // resto dos minutos

  const timeString = [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(':')

  return timeString
}
