/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="africa" width="235" height="321.9" viewBox="0 0 235 321.9"><defs><style>.cls-1,.cls-2{fill:none;stroke:#000}.cls-1{stroke-linecap:round;stroke-linejoin:round}.cls-2{stroke-miterlimit:10}.cls-10,.cls-11,.cls-12,.cls-3,.cls-4,.cls-7,.cls-9{stroke-width:0}.cls-4{fill:#4f4f4f}.cls-7{fill:#d66749}.cls-9{fill:#d8bb2b}.cls-10{fill:#b18d6b}.cls-11{fill:#f2d949}.cls-12{fill:#fff}</style></defs><path d="M20.8 299.4c-.4 1.3-.3 7.2.7 8.2 1.1 1.2 3.1 1.3 4.8 1.3 5.5 0 10.9.1 16.4 0 2 0 5.8.3 7.2-1 1.7-1.6.8-10.2-.5-12.1-5.3.4-12.4-.8-16.7-2-1.7-.5-3-1-3.5-1.4-2.8 1.2-7.7 4.2-8.4 6.9Z" class="cls-4"/><path d="m67.2 180 .2-.6c-1.2-5.1-7.1-1.3-10.7-.7-5.7.7-11.3-7.5-14.5-10-1.9-1.5-3.4-2.5-4.9-3.1.7-1.2 1.2-2.5 1.7-3.9.4-1.4.9-3.2 1.5-5.2-4.4-3-9.8-3.3-15.2-3.8-1.1 5.9-2.1 12.3-2.2 14-.3 5.8 8.9 13.7 14.2 15.9.7.3 1.5.6 2.3.9 4 1.3 9.7 2.7 13 4.3 0 3.1 5.2 5.7 7.8 6.5.2 0 .4.1.6.1h.9c2.3.3 6.1.4 7.8.2h.8c2.1-.4 6.3-2.1 8.2-3.7-1.7-5.3-6.2-9.5-11.5-11Z" class="cls-10"/><path d="M27.3 143.3c-.6 1.7-1.4 5.4-2.1 9.5 5.4.5 10.8.8 15.2 3.8.7-2.4 1.4-5.2 2.2-8 .9-3.4 1.7-6.9 2.4-10.2.7-5 .9-8.7-.4-12.6-.5-1.4-1.2-2.9-2.1-4.4-1.3-2-3.1-2.2-4.5-2.6-1.8.9-1.9 1-3.1 2.4-2.5 2.9-6 17-7.6 22.1" class="cls-9"/><path d="M32.8 250.5c-.5 7.2-3.6 41.9-3.6 41.9.5.4 1.8.9 3.5 1.4l10.9-101.9c-2.6-.5-4.4-1-4.7-1.5l-.4 6.6c-.7 6.6-4.8 40.9-5.7 53.4Z" class="cls-7"/><path d="M61.8 194.6h-.9c-4.6-.6-12.4-1.5-17.3-2.5L32.7 294c4.3 1.2 11.5 2.4 16.7 2 1.1 0 2.1-.2 3-.4 0 .2 4.8-39.7 5.2-43 1-7.3 3.4-21.2 5.6-31.8-.2 3 4.4 25.5 4.9 33.2.1 1.5 6 41.6 6 42.1.9 0 1.8.1 2.6.2 9 .5 13.2-1 18.1-2.6L85.4 193c-5 .5-12.8 1.6-15.1 1.8h-.8c-1.8.2-5.6 0-7.8-.2Z" style="stroke-width:0;fill:#808180"/><path d="M74.9 101.9c-1.7 2.4-4.1 2.8-7.4 2.3-5.6-.7-9.4-5.6-8.6-5.2 4.1 1.7 11.6 3.8 15.9 2.9Zm12.9-24.2v-3.5c-2-11.3-10.1-14.6-19.1-15.2-6.4-.4-13.9 1.6-19.6 10.7-2 3.2-3.3 7.8-4 9s-2.8 1-2.8-.4c-.5-1.3-1.7-1.8-2.7-1.6q-.3 0-.6.3c-1.2.8-1.9 2.7-1.9 4.5s.5 3.6 1.2 5.2c.6 1.5 1.4 2.9 2.5 3.6.7.5 1.5.7 2.3.4 1.2 7.8 7.4 14.2 10 16.5.5.4 1 .8 1.4 1.2 8.3 6.8 13.9 6.5 18.4 3.5 2.8-1.9 5.2-4.8 7.6-7.6 2.7-3.2 5.1-7.1 6.3-13 .6-2.8.9-6 1-9.8v-3.9ZM58.2 84c0-1.7.8-3.1 1.7-3.1s1.7 1.4 1.7 3.1-.8 3.1-1.7 3.1-1.7-1.4-1.7-3.1m19.8-.2c0-1.5.6-2.7 1.4-2.7s1.4 1.2 1.4 2.7-.6 2.7-1.4 2.7-1.4-1.2-1.4-2.7" class="cls-10"/><path d="M43.5 192c5 1 12.7 1.8 17.3 2.5-.3 0-.5 0-.6-.1-2.6-.8-7.7-3.5-7.8-6.5-3.3-1.6-9-3-13-4.3l-.2.7s-.2 3.2-.4 6.3c.3.5 2.1 1 4.7 1.5Z" class="cls-11"/><path d="M37.9 118.7c1.4.4 3.2.5 4.5 2.6 1 1.5 1.6 3 2.1 4.4h.4c2.4-4.4 5.7-7.6 10.5-8.4-1-1-1.6-2-1.5-3.1-1.2.7-14.8 3.8-16 4.5" class="cls-12"/><path d="M87.5 155.8v-2.2c0-7.8.4-11.3-.2-19.4-.4-2.7-.6-5.2-1.1-7.5h-.1c-2.3-4.7-10.9-9.1-14.1-9.4h-.1c-1.7 3.5-5.4 5.8-9.9 3.8-2.4-1.1-5-2.3-6.5-3.8-4.9.8-8.1 4-10.5 8.3h-.4c1.3 4 1.1 7.7.4 12.7-.7 3.3-1.5 6.8-2.4 10.2h.3c-.1 2.1-.3 17.6-.7 20.2 3.3 2.5 8.8 10.8 14.5 10 3.6-.6 9.5-4.4 10.7.7 4 1.4 10.6 0 16.9-6 1.2-1.1 2.2-2.4 3.2-3.7v-14Zm-30.2.4v-4.3l10.6-16.8h5.9v16.2h2.3v5.1h-2.3v5.1h-5.4v-5.2H57.3Z" class="cls-11"/><path d="M57.3 151.9v4.3h11.1v5.2h5.4v-5.1h2.3v-5.1h-2.3V135h-5.9l-10.6 16.8Zm6.2-.6c.6-.9 1.4-2 2.3-3.5l.5-.8c.9-1.5 1.7-3 2.3-4.5-.1 1.3-.2 3.1-.2 5.4v3.4h-5Z" class="cls-12"/><path d="M59.9 80.8c-.9 0-1.7 1.4-1.7 3.1S59 87 59.9 87s1.7-1.4 1.7-3.1-.8-3.1-1.7-3.1" class="cls-3"/><path d="M59 99c-.9-.4 3 4.5 8.6 5.2 3.3.4 5.6 0 7.4-2.2-4.3.8-11.8-1.3-15.9-3Z" class="cls-12"/><path d="M61.7 194.6h-.6z" style="stroke-width:0;fill:#e0bfa4"/><path d="M65.8 147.8c-.9 1.5-1.7 2.7-2.3 3.5h5v-3.4c0-2.3 0-4.1.2-5.4-.6 1.6-1.4 3.1-2.3 4.5l-.5.8Z" class="cls-11"/><path d="M87.5 169.8c-1.1 1.3-2.1 2.6-3.2 3.7-6.4 6-12.9 7.4-16.9 6l-.2.6c5.3 1.5 9.8 5.7 11.5 11 .3-.2.5-.5.7-.7 2.6-3.8 5.4-5.1 9.3-7.3.5-.3 1.1-.6 1.7-.9 6.4-3.7 13.1-8.9 10.7-16.6-.4-1.3-1-4.2-1.9-7.9-.3-1-.5-2.3-.8-3.9-3.2-.1-8.1.4-10.9 2.2v14Z" class="cls-10"/><path d="M88.4 192.6h1c0-1.7-.6-7.2-.7-9.5-3.9 2.2-6.7 3.5-9.3 7.3-.2.2-.4.5-.7.7-1.9 1.5-6.1 3.3-8.2 3.7 2.3-.2 10.1-1.3 15.1-1.8 1.1-.1 2.1-.2 2.8-.3Z" class="cls-11"/><path d="M72.8 112c-4.5 3-10 3.3-18.4-3.5 0 3.6-.3 3.4-.5 5.8-.1 1.1.5 2.1 1.5 3.1 1.6 1.4 4.1 2.7 6.5 3.8 4.6 2 8.3-.3 9.9-3.9s.6-1.5.8-2.2c.2-.9.3-1.9.2-2.9Z" class="cls-10"/><path d="M95 293.6c-5 1.6-9.2 3-18.1 2.6-1.1 2-1.1 10.4.9 11.6 1.5.8 19.6 1.4 24.7 1.1.5 0 3.4-.6 3.8-.8 1.5-.6.8-8.8 0-10.2-1.1-2-4.2-3.8-7.3-5.1v-.4c-1.5.4-2.8.8-4.1 1.2Z" class="cls-4"/><path d="M79.4 81.1c-.8 0-1.4 1.2-1.4 2.7s.6 2.7 1.4 2.7 1.4-1.2 1.4-2.7-.6-2.7-1.4-2.7" class="cls-3"/><path d="M86.2 126.6c-.5-2.9-1.2-5.7-2.5-8.7-3.7-1.2-9.4-2.6-10.8-2.9h-.2c-.2.7-.4 1.5-.8 2.2h.1c3.2.3 11.8 4.8 14.1 9.4z" class="cls-12"/><path d="M85.6 192.9 95 293.6c1.2-.4 2.5-.8 4-1.2h.3c0-1.1-5.2-37.2-5.4-39.6-1.1-12.5-3.2-38.9-3.7-44.2-.6-5.5-.8-10.3-1.7-16-.7 0-1.7.2-2.8.3Z" class="cls-7"/><path d="M83.7 117.9c1.3 3 2 5.8 2.5 8.7.4 2.3.7 4.8 1.1 7.5.6 8.1.2 11.6.2 19.4v2.2c2.7-1.8 7.6-2.3 10.9-2.2-1.5-8.4-3.2-23.4-5.7-27.4-1.9-3-2.8-5.4-5.9-7.1-.5-.3-1.7-.7-3.1-1.2Z" class="cls-9"/><path d="M86.7 91.4h.3c1.5 1.1 3.7-2.5 4.1-5.1.3-1.9 0-3.9-.3-5.8-.1-.7-.2-1.4-.6-1.9-.2-.3-.6-.5-1-.6-.5-.2-1.1-.3-1.4-.2v3.9c0 3.8-.4 7-1 9.8Z" class="cls-10"/><path d="M87.8 74.2v3.5c.3 0 .9 0 1.4.2 0-4.9.8-13.2-2.2-20-4-9-17.2-10.8-24.5-10.6-8.3.2-14.1 3.9-19 11.7-3.3 5.3-4.5 9.9-3.9 17.8 1-.2 2.2.4 2.7 1.6 0 1.5 2.1 1.7 2.8.4.7-1.2 2-5.8 4-9 5.7-9.1 13.2-11.1 19.6-10.7 9 .6 17.1 3.9 19.1 15.2Z" style="stroke-width:0;fill:#1e160d"/><path d="M72.9 112.1c0 1 0 1.9-.2 2.9-.2.8-.4 1.5-.8 2.2-1.7 3.5-5.4 5.9-9.9 3.9-2.4-1.1-5-2.3-6.5-3.8-1-.9-1.6-1.9-1.5-3.1.2-2.4.5-2.2.5-5.8m18.4 6.6c1.4.3 7.1 1.7 10.8 2.9 1.4.5 2.6.9 3.1 1.2 3.1 1.7 4 4.1 5.9 7.1 2.5 4 4.2 19.1 5.7 27.4.3 1.6.6 2.9.8 3.9m-60.3 4.2c.4-1.4.9-3.2 1.5-5.2.7-2.4 1.4-5.2 2.2-8 .9-3.4 1.7-6.9 2.4-10.2m8.9-24c-1.2.7-14.8 3.8-16 4.5-1.8.9-1.9 1-3.1 2.4-2.5 2.9-6 17-7.6 22.1m33.7 51.2c-4.6-.6-12.4-1.5-17.3-2.5-2.6-.5-4.4-1-4.7-1.5m22.8 4.1h-.6m.9 0h-.2m26.9-12.1v.5c0 2.3.8 7.8.7 9.5h-1c-.7 0-1.7.2-2.8.3-5 .5-12.8 1.6-15.1 1.8" class="cls-2"/><path d="M87.3 134.2c.6 8.1.2 11.6.2 19.4v16.2m-44.7-21.2c-.1 2.1-.3 17.5-.7 20.2m57.1-11.3c.8 3.8 1.5 6.7 1.9 7.9 2.4 7.7-4.3 12.9-10.7 16.6-.6.3-1.1.6-1.7.9-3.9 2.2-6.7 3.5-9.3 7.3-.2.2-.4.5-.7.7-1.9 1.5-6.1 3.3-8.2 3.7-.3 0-.6.1-.8 0" class="cls-2"/><path d="M95 163.7c-3.3 1-5.4 3.6-7.5 6.1-1.1 1.3-2.1 2.6-3.2 3.7-6.4 6-12.9 7.4-16.9 6m-40.1-36.2c-.6 1.7-1.4 5.4-2.1 9.5-1.1 5.9-2.1 12.3-2.2 14-.3 5.8 8.9 13.7 14.2 15.9.7.3 1.5.6 2.3.9 4 1.3 9.7 2.7 13 4.3.2 0 .4.2.6.3" class="cls-2"/><path d="M56.6 178.8c-5.7.7-11.3-7.5-14.5-10-1.9-1.5-3.4-2.5-4.9-3.1-1.8-.8-3.7-1.1-6.6-1.2m39 30.3c-1.8.2-5.6 0-7.8-.2h-.9c-.3 0-.5 0-.6-.1-2.6-.8-7.7-3.5-7.8-6.5m4.1-9.2c3.6-.6 9.5-4.4 10.7.7m21.1 13c1 5.6 1.1 10.5 1.7 16 .6 5.3 2.6 31.7 3.7 44.2.2 2.4 5.4 38.5 5.4 39.6h-.3c-1.4.4-2.7.8-4 1.2-5 1.6-9.2 3-18.1 2.6-.8 0-1.7 0-2.6-.2 0-.5-5.9-40.6-6-42.1-.6-7.8-5.1-30.2-4.9-33.2" class="cls-2"/><path d="M66.6 206.7s0 .2-.1.3c-.7 1.9-1.9 7.2-3.3 13.6-2.2 10.6-4.6 24.5-5.6 31.8-.4 3.3-5.2 43.3-5.2 43-.9.2-1.9.4-3 .4-5.3.4-12.4-.8-16.7-2-1.7-.5-3-1-3.5-1.4 0 0 3.1-34.8 3.6-41.9.9-12.5 5-46.8 5.7-53.4 0 0 .2-3.4.4-6.6s.4-6.3.4-6.3" class="cls-2"/><path d="M72.9 200.8c-1.7 1.4-4.7 4.4-6.4 6.2l-1 1" class="cls-2"/><path d="M29.2 292.5c-2.8 1.2-7.7 4.2-8.4 6.9-.4 1.3-.3 7.2.7 8.2 1.1 1.2 3.1 1.3 4.8 1.3 5.5 0 10.9.1 16.4 0 2 0 5.8.3 7.2-1 1.7-1.6.8-10.2-.5-12.1m27.4.3c-1.1 2-1.1 10.4.9 11.6 1.5.8 19.6 1.4 24.7 1.1.5 0 3.4-.6 3.8-.8 1.5-.6.8-8.8 0-10.2-1.1-2-4.2-3.8-7.3-5.1" class="cls-1"/><path d="M65.4 179.6c.6 0 1.2.2 1.8.4 5.3 1.5 9.8 5.7 11.5 11v.2m-39.8-29.5c-.4 1.3-1 2.6-1.7 3.9m-12.1-12.9c5.4.5 10.8.8 15.2 3.8 0 0 .2.1.3.2m46.9-.9c2.7-1.8 7.6-2.3 10.9-2.2m-60.5-34.9c1.4.4 3.2.5 4.5 2.6 1 1.5 1.6 3 2.1 4.4 1.3 3.8 1.1 7.6.4 12.6m38.8-20.4c1.3 3 2 5.8 2.5 8.7.4 2.3.7 4.8 1.1 7.5m-31.9-16.7c-4.9.8-8.1 3.9-10.5 8.2" class="cls-2"/><path d="M72.1 117.3c3.2.2 11.8 4.7 14.1 9.4m-10.1 29.6h-2.3v5.1h-5.4v-5.2H57.3v-4.3l10.6-16.8h5.9v16.1h2.3z" class="cls-2"/><path d="M68.6 142.4c-.6 1.6-1.4 3.1-2.3 4.5l-.5.8c-.9 1.5-1.7 2.7-2.3 3.5h5v-3.4c0-2.3 0-4.1.2-5.4Z" class="cls-2"/><path d="M87.9 70.7c0 1.3 0 2.4-.1 3.4v7.4c0 3.8-.4 7-1 9.8-1.3 6-3.6 9.8-6.3 13-2.4 2.8-4.8 5.7-7.6 7.6-4.5 3-10 3.3-18.4-3.5h0c-.5-.4-.9-.8-1.4-1.2-2.6-2.3-8.8-8.7-10-16.4" class="cls-1"/><path d="M82.6 76c-1-.8-5.2-.9-6.2-.4m-12.5-.3c-1.9-1-7-.3-7.4.4M78 83.8c0 1.5.6 2.7 1.4 2.7s1.4-1.2 1.4-2.7-.6-2.7-1.4-2.7-1.4 1.2-1.4 2.7m-19.8.2c0 1.7.8 3.1 1.7 3.1s1.7-1.4 1.7-3.1-.8-3.1-1.7-3.1-1.7 1.4-1.7 3.1m16.4 7.6c1.2 2.9-.4 5.2-4.4 5m5.2 5.2c-.2 0-.3 0-.5.1-4.3.9-11.8-1.2-15.9-2.9-.9-.4 3 4.5 8.6 5.2 3.3.4 5.6 0 7.4-2.2" class="cls-1"/><path d="M89.2 77.9c0-4.9.8-13.2-2.2-20-4-9-17.2-10.8-24.5-10.6-8.3.2-14.1 3.9-19 11.7-3.3 5.3-4.5 9.9-3.9 17.8" class="cls-1"/><path d="M42.4 78.6v-.2c-.5-1.2-1.7-1.8-2.7-1.6q-.3 0-.6.3c-1.2.8-1.9 2.7-1.9 4.5s.5 3.6 1.2 5.2c.6 1.5 1.4 2.9 2.5 3.6.7.5 1.5.7 2.3.4.5-.1.9-.4 1.2-.8m43.4-12.3c.3 0 .9 0 1.4.2.4.2.8.4 1 .6.3.6.5 1.3.6 1.9.3 1.9.6 3.9.3 5.8-.4 2.6-2.5 6.2-4.1 5.2" class="cls-1"/><path d="M42.3 78.4c0 1.5 2.1 1.6 2.8.4s2-5.8 4-9c5.7-9.1 13.2-11.1 19.6-10.7 9 .6 17.1 3.9 19.1 15.2 0 .2 0 .4.1.7M43.6 191.3l-.1.7-10.8 101.9m52.9-101L95 293.6v.8" class="cls-1"/></svg>')}`;
export default image;