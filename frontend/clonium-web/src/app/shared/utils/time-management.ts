/**
 * @description
 * An utility function that transforms a setTimeout to a Promise
 *
 * @author
 * Rafaa Seddik
 *
 * @param time
 */
export async function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
