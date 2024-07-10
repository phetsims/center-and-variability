/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="latinAmerica" width="235" height="321.9" viewBox="0 0 235 321.9"><defs><style>.cls-1,.cls-2{fill:none;stroke:#000}.cls-1{stroke-linecap:round;stroke-linejoin:round}.cls-2{stroke-miterlimit:10}.cls-3,.cls-4,.cls-6,.cls-7,.cls-8,.cls-9{stroke-width:0}.cls-4{fill:#4d443e}.cls-6{fill:#2b388d}.cls-7{fill:#444746}.cls-8{fill:#af856a}.cls-9{fill:#fff}</style></defs><path d="M210.9 209.1c17.8.4 7 13.7-.3 16-10.2 3.1-22.2 7-33.5 9.6-1.3.3-2.7 0-3.7-.8-.7-.6-.9-1.6-1.1-2.5-.9-4-2.6-9.3-2.5-13.3 1.7 2 6.9 2.5 8.6.6 1-1.1 1.3-2.7 1.4-4.3.2-1.5.3-3.1 1.1-4.4.2-.3.4-.6.7-.8.7-.6 1.5-.8 2.5-.2h.1c8.7.9 16.1 0 26.7.2Z" class="cls-7"/><path d="M169.8 217.9c-1.2-.4-2.4-.8-3.5-1.1l.2-.7c0-4.1 2.2-8.1 5.6-10.4 2.8 1 5.7 2.1 8.9 3.3l.5.2c-.2.2-.5.5-.7.8-.8 1.3-.9 2.9-1.1 4.4s-.4 3.1-1.4 4.3c-1.7 1.9-6.9 1.4-8.6-.6v-.2Z" class="cls-9"/><path d="M172.1 205.5c-3.4 2.5-5.5 6.5-5.6 10.6l-.2.7c-15-4.3-20.7 1-31.5-8.8-10.9-2-12.2.2-19.8-.2-2.5-7.2 2.6-20.9 6.1-24.1 9.2 3.8 8.5 2.3 19.9 9.3 11.9 4.4 20.6 8.3 31.1 12.5" class="cls-8"/><path d="M130.2 299.2c16.1 7.5.9 15.4-6.7 14.5-10.6-1.2-23.1-2.5-34.6-4.7-1.3-.2-2.5-1-3-2.2-.4-.9-.2-1.8 0-2.8.8-4 1.3-9.6 3.1-13.2 0 .3.2.5.4.8 1.3 2.2 5.1 4.2 7.3 3.2 1.4-.6 2.3-2 3-3.3.5-.9 1-1.7 1.6-2.5.3-.4.7-.8 1.2-1.1 1.2-.9 2.4-.9 3.4.3h.1c7.7 4.4 14.7 6.5 24.4 11Z" class="cls-7"/><path d="M109 113.1c.5-3.4.9-6.9.7-10.2.8-.9 1.7-2 3-4.1 1.2-2 2.8-4.7 3.2-7.1.5-2.6.7-5.2 1-7.9.3-2.1.6-4.2.5-6.3-.3-9.1-4.6-13.3-11.3-18.9-1-.8-10.5 1.5-16.5 7.6-2.4 2.5-5.1 4.1-6.6 8.9-2.2 7.3-3.8 14.6-4.2 22-.1 2.4-.1 4.7 0 7.1 0 1.7.3 3.4.5 5.1 0 .4.1.9.2 1.3.2 1.3.5 2.6.8 3.9.8 3.5 2.5 8.6 1.8 12.3-.1.7-.9 1-1.5.7-4.2-2.3-7-8.7-8.3-13.2-.5-1.7-1-3.5-1.4-5.2-.3-1.3-.6-2.7-.9-4 0-.5-.2-1-.3-1.5-1.4-8.8-1.5-17.6-.3-26.5 1.3-9.5 3.4-20.1 12.4-25.6 7.7-4.7 21.6-4.9 24.7-2.6v-.2c8.7 4.5 12 10.2 14.6 17.4 1.8 5.1 2.1 12.6 1.2 17.9s-2.1 10.7-3.3 15.9c-1.2 5.7-3 11.8-5.1 17.4-1.4 3.8-2.9 7.4-4.5 10.4-.6 1.3-2.6.7-2.5-.7.1-4 1-8.5 1.7-13 0-.3 0-.5.1-.8Z" class="cls-4"/><path d="M115.1 207.8c0 .3.2.6.3.9.1.2-.7.3-2.3.1-7-.7-28-4.8-37.5-6.7-2.2-.6-4.1-1.1-5.2-1.6-4.7-2.4-11-8.9-11.3-20.6 0-1.3 0-2.6.1-4.1 1.5-9.9 15.5-6.6 32.2-2.9 8.3 1.8 10.5 3.9 14.7 4.9.3 0 .7.2 1 .2 6.1 1.9 15.1 4.7 14 5.6-3.5 3.2-8.5 16.9-6.1 24.1Z" class="cls-7"/><path d="M118.8 143.6c-3.2-.7-10.7-1.7-15.5.9-.3-2.9-.9-5-.9-10 0-2.4-.9-11 1.6-16.3 1-2.1 2.5-3.7 4.8-4.3-.7 4.5-1.6 9-1.7 13 0 1.4 1.9 1.9 2.5.7 1.6-3 3.1-6.6 4.5-10.4.6.6.8.8 1 1.4 4.3 10.6 5.6 25.5 5 25.3-.2 0-.7-.2-1.3-.3" class="cls-6"/><path d="M78.6 142.3c1.6.8 3.2 1.8 4.4 2.8 1.1 1 1.8 1.9 1.9 2.7 7.5-1.4 11.2-1 18.7-2.5l-.2-.9c4.8-2.6 12.3-1.6 15.5-.9.3 3.4.6 6.2-1 9.5-1 2.1-2.2 2.3-3.1 2.9-3.8 1.5-7 2.4-10 2.8-7.9 1.2-14-.5-24.9-1.7-2.6 1-12.3 1.3-13.3-1.4-.9-2.2 2.8-13.3 5.7-14.7 1.2-.6 3.8.1 6.4 1.4Zm22.4-33.1h-.2c-4.4 1.2-10.1-.6-19.2-9.5l-2.8-2.8c.4-7.3 2-14.6 4.2-21.9 1.5-4.9 4.2-6.5 6.6-9 6-6.1 15.5-8.4 16.5-7.6 6.6 5.6 11 9.8 11.3 18.9 0 2.1-.2 4.2-.5 6.3-.3 2.6-.6 5.3-1 7.9-.4 2.5-2 5.1-3.2 7.1-1.3 2.2-2.2 3.4-3 4.2-.5.6-1 1-1.6 1.6-2.2 2.1-4.4 4-7 4.8ZM115.5 75c.4-.3.2-.9-.2-1.3-.8-.9-2-1.4-3.2-1.5s-2.4-.1-3.6 0c-.9.2-1.7.7-1.8 1.3 0 .6.6 1.4 1.6 1.5.4 0 6.9 0 7.1-.1Zm-3.4 7.8c.2-1.7-.4-3.1-1.2-3.2-.9 0-1.7 1.2-1.9 2.8s.4 3.1 1.2 3.2c.9 0 1.7-1.2 1.9-2.8m-12.5 18.8c3 0 4.4-.8 6-3.1-5.2 1.7-14.9-1.8-15.8-2.9.9 2.1 1.4 2.8 3.4 4 1.8 1.2 4.6 2 6.4 2m-2.2-28.3c1.1-2.7-4.8-3.2-6.6-3-1.2.1-5.1 1.3-4.5 2.8.2.4 8.7 1.3 9.4 1.2s1.4-.5 1.7-1.1Zm-3.6 7.5c.2-1.7-.4-3.1-1.2-3.2-.8 0-1.7 1.2-1.9 2.8s.4 3.1 1.2 3.2c.9 0 1.7-1.2 1.9-2.8" class="cls-8"/><path d="M117.6 231.4c-.5 0-1 .2-1.4.2-8.4 1.4-13.4 1.7-22.7.8-1.1-.1-2.3-.2-3.6-.4-1.6-4.5-6.3-19.3-14.2-29.9 9.5 1.9 30.6 6 37.5 6.7v.2c3.1 11.2 3.8 14.3 4.4 22.4" class="cls-7"/><path d="M116.2 232c3.1 4.8-2.1 13.5-4.7 23.5-2.1 7.7-4.7 17-7.4 25.3h-.3c-4.6.5-9.4-.3-13.6-2.4 0-9.1-.5-18.3 1.8-24.9 1.1-3.4 2.4-7.3 2.9-10.8.5-3.6.2-6.4-1.4-9.6v-.6c9.4.9 14.4.6 22.8-.8v.4Z" class="cls-8"/><path d="M115.3 73.7c.3.4.5 1 .2 1.3-.2.2-6.7.2-7.1.1-1-.1-1.7-.9-1.6-1.5 0-.6.9-1.2 1.8-1.3q1.8-.3 3.6 0c1.8.3 2.4.6 3.2 1.5Zm-4.4 6c.8 0 1.4 1.5 1.2 3.2s-1 2.9-1.9 2.8c-.9 0-1.4-1.5-1.2-3.2s1-2.9 1.9-2.8" class="cls-3"/><path d="M109.7 102.8c.2 3.3-.2 6.8-.7 10.2-3-1.8-6.1-2.8-7.9-3.8 2.6-.8 4.8-2.7 7-4.8.6-.6 1.1-1 1.6-1.6" class="cls-4"/><path d="M109 113.1c0 .3 0 .5-.1.8-2.3.6-3.8 2.2-4.8 4.3-1.5-1.5-3.3-2.7-5.3-3.5h-.1c.5-.8 1-1.5 1.5-2.2.5-1.3.5-.8.8-3.3h.2c1.8 1 4.9 2.1 7.9 3.8Z" class="cls-9"/><path d="M106.1 177.7v.1c-4.1-1-6.4-3.1-14.7-4.9-16.7-3.6-30.7-7-32.2 2.9-.1 1.4-.2 2.8-.1 4.1-3.3-12-1.1-15.5 1-38.2.1-5.5.2-8.7.5-13.2.1-1.5.3-3.1.4-4.9.4-4.2 1.4-8.2 3.4-11.8.6-1.1 1.2-2 1.6-2.8h.1c1.5-.3 3.1-.4 4.7 0 .4 1.8.9 3.5 1.4 5.2 1.4 4.5 4.2 10.9 8.3 13.2.6.3 1.3 0 1.5-.7.7-3.7-1-8.9-1.8-12.3-.3-1.3-.6-2.6-.8-3.9h.2c.9 5.1 4.7 8.9 8.5 9.7 3.4.7 7.5-2.1 10.3-5.6h.1c2 .9 3.8 2.1 5.3 3.5-2.5 5.4-1.6 14-1.6 16.4 0 4.9.6 7.1.9 10l.2.9c-7.4 1.5-11.2 1.1-18.7 2.6 0-.9-.8-1.9-1.9-2.9 1.6-1.2 1.8-1.6 2.5-2.8.7-1.1 1.1-2.5 1.3-4.1.3-2.2 0-4-1-5.4s-2.5-2.2-4.5-2.5c-1.6-.2-3.1 0-4.4.8-1.1.6-2.3 1.7-3.5 3.3l3 3.9c.9-1.1 1.7-1.8 2.3-2.2.5-.3 1.2-.4 1.8-.4.5 0 .8.3 1.1.8.2.5.3 1 .3 1.6 0 .7-.3 1.4-.7 1.9s-1.1 1.2-2.1 1.8c-.2.1-.3.2-.5.4-2.5-1.2-5.2-2-6.4-1.4-2.9 1.4-6.6 12.5-5.7 14.7 1 2.6 10.7 2.3 13.3 1.4 11 1.2 17 3 24.9 1.7-.8 3 1.2 14 1.3 19Z" style="stroke-width:0;fill:#4a62ba"/><path d="M103.7 280.7h.3c-.9 3-1.9 5.7-2.8 8.3-.6.8-1.1 1.7-1.6 2.5-.7 1.3-1.6 2.7-3 3.3-2.1 1-6-1-7.3-3.2h.2c.5-4.2.6-8.7.6-13.2 4.2 2.1 9 2.9 13.6 2.3m1.9-182.2c-1.5 2.2-3 3-6 3.1-1.8 0-4.6-.8-6.4-2-2-1.3-2.4-1.9-3.4-4 .9 1.2 10.6 4.6 15.8 2.9" class="cls-9"/><path d="M79.7 110.5h-.2c0-.4-.1-.9-.2-1.3h.5c.6-1.6 1.1-3.6 1.4-5.6.2-1.4.3-2.7.3-3.8 9.1 8.9 14.8 10.8 19.2 9.5-.3 2.5-.3 2-.8 3.3q-.6 1.05-1.5 2.1c-2.8 3.5-6.9 6.3-10.3 5.6-3.8-.8-7.6-4.6-8.5-9.7Z" class="cls-8"/><path d="M90.7 70.3c1.8-.2 7.8.3 6.6 3-.3.6-.9 1-1.7 1.1s-9.3-.8-9.4-1.2c-.6-1.5 3.2-2.7 4.5-2.8Zm1.9 7.3c.9 0 1.4 1.5 1.2 3.2s-1 2.9-1.9 2.8c-.9 0-1.4-1.5-1.2-3.2s1-2.9 1.9-2.8" class="cls-3"/><path d="M85.8 132.8c1 1.4 1.3 3.2 1 5.4-.2 1.6-.6 3-1.3 4.1-.7 1.2-.9 1.6-2.5 2.7-1.2-1-2.8-2-4.4-2.8.2-.1.3-.2.5-.4q1.5-1.05 2.1-1.8c.4-.5.7-1.2.7-1.9 0-.6 0-1.2-.3-1.6-.3-.5-.6-.7-1.1-.8-.7 0-1.3 0-1.8.4-.6.3-1.4 1.1-2.3 2.2l-3-3.9c1.2-1.6 2.4-2.7 3.5-3.3 1.3-.7 2.7-1 4.4-.8 2.1.3 3.6 1.1 4.5 2.5" class="cls-9"/><path d="M81.6 99.8c0 1.1-.1 2.4-.3 3.8h-.1c-.8.3-2 0-2.2.5-.1-2.4-.1-4.7 0-7.1l2.8 2.8Z" class="cls-4"/><path d="M81.1 103.6h.1c-.3 2-.8 4-1.4 5.6h-.5c-.2-1.7-.4-3.4-.5-5.1.2-.4 1.4-.2 2.2-.5Zm-11 1.3c.2 1.3.5 2.7.9 4-1.5-.4-3.2-.4-4.7 0h-.1c1.6-2.7 2.6-3.5 4-4.1Z" class="cls-9"/><path d="M43 122.9c0-.6-.1-1.1 0-1.3.1-1 7.9-8.8 8.6-9.5 4.2-3.8 6.5-6.5 12-7.6.8-.2 3.6-.8 6.2-1.1 0 .5.2 1 .3 1.5-1.3.6-2.3 1.4-4 4-.5.8-1 1.7-1.6 2.8-2 3.7-3 7.6-3.4 11.8-.2 1.9-.3 3.5-.4 4.9-1.7 1.5-3.1 2.8-4.4 3.9-1.5 1.2-3.7 2.7-6.1 4.3-4.5-2.8-6.7-10.5-7.1-13.7Z" class="cls-6"/><path d="M56.3 132.4c-2.4 2-4.2 3.3-5.8 4.5-.1 0-.3-.1-.4-.2 2.4-1.6 4.6-3.1 6.1-4.3Z" style="stroke-width:0;fill:#e6ced6"/><path d="M30 162.3c2.4.7 4.7 9.6 3.2 11.6-1.7 2.1-11.5 3-13.1 1.9-1.9-1.3.2-9.1 1.5-11.1 2.7-12.3 4.3-18.7 11.6-29 3.3-4.7 6.6-9.4 9.8-12.8.4 3.2 2.6 11 7.1 13.7-2.7 1.8-5.7 3.8-8.4 5.9-4.7 8.6-8.2 12.6-11.7 19.7Z" class="cls-8"/><path d="M60.7 128.5c-1.7 1.6-3.1 2.8-4.4 3.9-2.4 2-4.2 3.3-5.8 4.5-.1 0-.3-.1-.4-.2-4.5-2.8-6.7-10.5-7.1-13.7 0-.6-.1-1.1 0-1.3.1-1 7.9-8.8 8.6-9.5 4.2-3.8 6.5-6.5 12-7.6.8-.2 3.6-.8 6.2-1.1h.2" class="cls-1"/><path d="M43 122.9s0 0 0 0c-3.3 3.4-6.6 8.1-9.8 12.8-7.2 10.3-8.9 16.7-11.6 29m34.7-32.3c-1.5 1.2-3.7 2.7-6.1 4.3-2.7 1.8-5.7 3.8-8.4 5.9-4.7 8.6-8.2 12.6-11.7 19.7 0 .2-.2.4-.3.5" class="cls-1"/><path d="M30.1 162.3c2.4.7 4.7 9.6 3.2 11.6-1.7 2.1-11.5 3-13.1 1.9-1.9-1.3.2-9.1 1.5-11.1m87.3-51.6s0 0 0 0c-3-1.8-6.1-2.8-7.9-3.8q0 0 0 0m1.3 25.2c0 4.9.6 7.1.9 10 4.8-2.6 12.3-1.6 15.5-.9.6.1 1 .2 1.3.3.7.2-.7-14.7-5-25.3-.3-.6-.4-.9-1-1.4h0m.6 38.7c-3.8 1.5-7 2.4-10 2.8-7.9 1.2-14-.5-24.9-1.7" class="cls-1"/><path d="M108.8 144.1c-2 .5-3.7.9-5.3 1.3-7.4 1.5-11.2 1.1-18.7 2.6-.2 0-.5 0-.7.1" class="cls-1"/><path d="M84.9 147.8c0-.8-.8-1.8-1.9-2.7-1.2-1-2.8-2-4.4-2.8-2.5-1.2-5.2-2-6.4-1.4-2.9 1.4-6.6 12.5-5.7 14.7 1 2.6 10.7 2.3 13.3 1.4m39-13.5s0 0 0 0c.3 3.4.6 6.2-1 9.5-1 2.1-2.2 2.3-3.1 2.9m-54.6-14.2c-2.1 22.7-4.3 26.1-1 38.2 0 .3.2.6.3 1m45.4-22.2s0 0 0 0c-.8 3 1.2 14 1.3 19v.1m-36-72.9c-1.3.6-2.3 1.4-4 4-.5.8-1 1.7-1.6 2.8-2 3.7-3 7.6-3.4 11.8-.2 1.9-.3 3.5-.4 4.9-.3 4.5-.4 7.8-.5 13.2v.8" class="cls-1"/><path d="M75.6 202.1c9.5 1.9 30.6 6 37.5 6.7 1.6.2 2.4.1 2.3-.1-.1-.3-.3-.6-.3-.9-2.5-7.2 2.6-20.9 6.1-24.1 1-.9-7.9-3.8-14-5.6-.3-.1-.7-.2-1-.3-1.4-.4-2.6-.8-3.4-1.1" class="cls-1"/><path d="M70.4 200.5c1.2.5 3 1 5.2 1.6m0 0c7.8 10.6 12.6 25.5 14.2 29.9 1.3.1 2.5.3 3.6.4 9.3.9 14.3.6 22.7-.8.5 0 .9-.2 1.4-.2-.6-8.2-1.3-11.3-4.4-22.4m3.1 23c3.1 4.8-2.1 13.5-4.7 23.5-2.1 7.7-4.7 17-7.4 25.3-.9 2.9-1.9 5.6-2.8 8.2m-8-55.9c1.6 3.3 2 6 1.4 9.6-.5 3.5-1.8 7.4-2.9 10.8-2.3 6.6-1.8 15.8-1.8 24.9 0 4.5 0 9-.6 13.2M59.2 175.8c-.1 1.4-.2 2.8-.1 4.1.3 11.7 6.6 18.2 11.3 20.6m50.7-16.8c9.2 3.8 8.5 2.3 19.9 9.3m-25.9 14.8c7.6.3 8.8-1.9 19.8.2m-.1 0c10.7 9.8 16.5 4.5 31.5 8.8 1.1.3 2.3.7 3.5 1.1 1 .4 2.1.8 3.2 1.2m8-10.2c-3.2-1.2-6.1-2.3-8.9-3.4-10.5-4.2-19.2-8.2-31.1-12.5" class="cls-1"/><path d="M107.5 178.1h-.4c-.3 0-.7-.1-1-.2-4.1-1-6.4-3.1-14.7-4.9-16.7-3.6-30.7-7-32.2 2.9" class="cls-1"/><path d="M100.9 108.7v.6c-.3 2.5-.3 2-.8 3.3q-.6 1.05-1.5 2.1c-2.8 3.5-6.9 6.3-10.3 5.6-3.8-.8-7.6-4.6-8.5-9.7 0-.3-.1-.7-.1-1m29.3 4.2h-.2c-2.3.6-3.8 2.2-4.8 4.3-2.5 5.4-1.6 14-1.6 16.3" class="cls-2"/><path d="M81.6 99.4v.4c0 1.1-.1 2.4-.3 3.8-.3 2-.8 4-1.4 5.6" class="cls-1"/><path d="M81.1 103.6c-.8.3-2 0-2.2.5m33.7-5.4c-1.3 2.2-2.2 3.3-3 4.1-.5.6-1 1-1.6 1.6-2.2 2.1-4.4 4-7 4.8h-.2c-4.4 1.2-10.1-.6-19.2-9.5l-2.8-2.8h0m12-16.4c-.2 1.7.4 3.1 1.2 3.2.9 0 1.7-1.2 1.9-2.8.2-1.7-.4-3.1-1.2-3.2-.8 0-1.7 1.2-1.9 2.8m15.1 12.2c-3.3 2.1-3.4 1.7-7.4 1.1" class="cls-1"/><path d="M105.6 98.5c-5.2 1.7-14.9-1.8-15.8-2.9.9 2.1 1.4 2.8 3.4 4 1.8 1.2 4.6 2 6.4 2 3 0 4.4-.8 6-3.1m7 .1c1.2-1.9 2.8-4.6 3.2-7.1.5-2.6.7-5.2 1-7.9.3-2.1.6-4.2.5-6.3-.3-9.1-4.6-13.3-11.3-18.9-1-.8-10.5 1.5-16.5 7.6-2.4 2.5-5.1 4.1-6.6 8.9" class="cls-1"/><path d="M106.7 48.6s0 0 0 0c8.6 4.5 11.9 10.2 14.5 17.4 1.8 5.1 2.1 12.6 1.2 17.9s-2.1 10.7-3.3 15.9c-1.2 5.7-3 11.8-5.1 17.4-1.4 3.8-2.9 7.4-4.5 10.4-.6 1.3-2.6.7-2.5-.7.1-4 1-8.5 1.7-13 0-.3 0-.5.1-.8.5-3.4.9-6.9.7-10.2m-39.4 2c.2 1.3.5 2.7.9 4 .4 1.8.9 3.5 1.4 5.2 1.4 4.5 4.2 10.9 8.3 13.2.6.3 1.3 0 1.5-.7.7-3.7-1-8.9-1.8-12.3-.3-1.3-.6-2.6-.8-3.9 0-.4-.1-.9-.2-1.3-.2-1.7-.4-3.4-.5-5.1-.1-2.4-.1-4.7 0-7.1.4-7.3 2-14.6 4.2-21.9m-13.3 28.4c0 .5.2 1 .3 1.5" class="cls-1"/><path d="M106.7 48.8c-3.1-2.4-17.1-2.1-24.7 2.6-9 5.5-11.2 16-12.4 25.6-1.2 8.9-1.2 17.8.3 26.5" class="cls-1"/><path d="M97.4 73.3c-.3.6-.9 1-1.7 1.1s-9.3-.8-9.4-1.2c-.6-1.5 3.2-2.7 4.5-2.8 1.8-.2 7.8.3 6.6 3Zm11 1.8c-1-.1-1.7-.9-1.6-1.5 0-.6.9-1.2 1.8-1.3q1.8-.3 3.6 0c1.8.3 2.4.6 3.2 1.5.3.4.5 1 .2 1.3-.2.2-6.7.2-7.1.1Zm.6 7.4c-.2 1.7.4 3.1 1.2 3.2.9 0 1.7-1.2 1.9-2.8.2-1.7-.4-3.1-1.2-3.2-.9 0-1.7 1.2-1.9 2.8" class="cls-1"/><path d="M98.7 114.7c2 .8 3.8 2 5.3 3.4M66.3 109c1.5-.4 3.1-.4 4.7 0h.1" class="cls-2"/><path d="M78.2 142.5c.1 0 .2-.2.3-.2.2-.1.3-.2.5-.4q1.5-1.05 2.1-1.8c.4-.5.7-1.2.7-1.9 0-.6 0-1.2-.3-1.6-.3-.5-.6-.7-1.1-.8-.7 0-1.3 0-1.8.4-.6.3-1.4 1.1-2.3 2.2l-3-3.9c1.2-1.6 2.4-2.7 3.5-3.3 1.3-.7 2.7-1 4.4-.8 2.1.3 3.6 1.1 4.5 2.5 1 1.4 1.3 3.2 1 5.4-.2 1.6-.6 3-1.3 4.1-.7 1.2-.9 1.6-2.5 2.7M89 290.8c0 .3.2.5.4.8 1.3 2.2 5.1 4.2 7.3 3.2 1.4-.6 2.3-2 3-3.3.5-.9 1-1.7 1.6-2.5.3-.4.7-.8 1.2-1.1 1.2-.9 2.4-.9 3.4.3" class="cls-1"/><path d="M89 290.8c-1.7 3.6-2.3 9.2-3.1 13.2-.2.9-.3 1.9 0 2.8.5 1.2 1.8 2 3 2.2 11.4 2.2 24 3.5 34.6 4.7 7.6.9 22.8-7 6.7-14.5-9.7-4.5-16.7-6.6-24.4-10.9m63.9-70.3c1.7 2 6.9 2.5 8.6.6 1-1.1 1.3-2.7 1.4-4.3.2-1.5.3-3.1 1.1-4.4.2-.3.4-.6.7-.8.7-.6 1.5-.8 2.5-.2" class="cls-1"/><path d="M169.7 218c-.1 4 1.6 9.4 2.5 13.3.2.9.5 1.9 1.1 2.5.9.9 2.4 1.1 3.7.8 11.4-2.6 23.3-6.5 33.5-9.6 7.4-2.3 18.1-15.6.3-16-10.7-.2-18 .7-26.7-.2" class="cls-1"/><path d="M90 278.4c4.2 2.1 9 2.9 13.6 2.3m68.5-75.1c-3.4 2.3-5.5 6.3-5.6 10.4" class="cls-2"/></svg>')}`;
export default image;