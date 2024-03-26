/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="africa" width="235" height="321.9" viewBox="0 0 235 321.9"><defs><style>.cls-1,.cls-2{fill:none;stroke:#000}.cls-1{stroke-linecap:round;stroke-linejoin:round}.cls-2{stroke-miterlimit:10}.cls-3,.cls-4,.cls-5,.cls-7,.cls-8{stroke-width:0}.cls-4{fill:#3a3a3a}.cls-5{fill:#3d8e3d}.cls-7{fill:#a0715e}.cls-8{fill:#fff}</style></defs><path d="M24.3 145.8c1.7-1.2 2.5-1.9 4.2-3.5-3-1.6-7.5-6-10.4-11.3l-.3-.2c-3.6 5.2-6.7 9.6-6.7 9.6-2.8 5 3.4 15 7.3 20.5 3.7 4.3 7.6 9.4 9.8 11.7.9-3.2 3.8-5.8 7-6.8-2.1-.7-5.9-10.3-7-12.6q-.45-1.35-.9-2.4c-1.1-2.2-1.9-3.7-3-4.9Zm-13.1 153c-.4 1.3-.3 7.2.7 8.2 1.1 1.2 3.1 1.3 4.8 1.3 5.4 0 10.9.1 16.3 0 2 0 5.8.3 7.2-1 1.7-1.6.6-10.9-.6-12.8-1.8-2.8-3.4-3.1-6.8-3.9-1.9-.4-4.2-.9-6.8-.7-2.1.1-4.2.6-6.4 1.8-2.8 1.2-7.6 4.2-8.4 6.9Z" class="cls-8"/><path d="m17.8 130.8.3.2c2.9 5.3 7.4 9.7 10.4 11.3.8.4 1.5.7 2 .7 3-2.8 5.7-6.1 8-9.2 3.1-4.2 5.5-8.2 6.6-10.4 2.6-5.2 3.6-13.8.3-17.5-1.4-1-2.7-1.4-3.6-1.8-1.2 0-.7 0-1.8.5-3.5 1.5-9.2 7.5-11.6 10.9-.9 1.3-6.2 8.8-10.7 15.3Z" class="cls-5"/><path d="M63.4 205.5c4.1 16.4 6.6 17.4 7.7 35 .8 13.2 12.5 33.6 15.4 55.4 1.1-2 1.9-3.3 4.3-3.9 1.6-.4 6.3-.8 9.1-1-.6-15.4.4-37.4-3.1-50.3-2.6-10-3.3-43.4-7.6-55.8-10.4 11.3-37.6 8.3-54 .6-.4 5.5-1.5 27.4-1.6 28.2-1.2 9.5-.3 19.2-3.8 27.4-5.4 13-3.1 34.2-3.8 48.7v.3c2.5-.2 4.9.3 6.8.7 3.5.8 5 1.1 6.8 3.9 4-21.3 13.8-37.6 15.1-53.3 1.1-12.9 6-22.2 8.8-35.8Z" class="cls-4"/><path d="M28.2 172.6c-1.2 2.8 2.1 7.2 4 9.1.6.6 2.4 1.8 4.1 2.5 2.1.9 4.2 1.1 4.1-1.2 1 0 3.3-1.2 2.1-2.8 1.3-.2 2.7-1.6 1.9-3.5 4.2-1 2.5-3.4.6-5.3.8-3.8-3.3-4.5-6.9-5.1-1.1-.2-2.2-.4-3-.6-3.2 1-6.1 3.6-7 6.8Z" class="cls-7"/><path d="M35.1 185.5c16.3 7.6 43.5 10.6 54-.6-.1-5.1-.5-12.1-.9-19.1-.3-6.5-.6-13-.6-17.9s.8-5.9 1.6-9c1.2-4.8 2.4-10.1.2-17.7-.3-1-2.1-7-2.5-8.1-2.1 7.5-5.5 20.5-19.1 19.3-8.6-.8-12.3-13.6-18-21.9-1.6-2.3-3-3.6-4.4-4.5 3.3 3.7 2.3 12.3-.3 17.5-1.2 2.2-3.5 6.2-6.6 10.4 3 13.4 2.4 21-.3 32.3v.2c3.5.6 7.6 1.3 6.8 5.1 1.9 1.9 3.6 4.3-.6 5.3.8 2-.6 3.3-1.9 3.5 1.2 1.6-1.1 2.8-2.1 2.8.1 2.3-2 2.1-4.1 1.2h-1.1v1.3ZM65.7 141l.2-3.7c1.3 0 2.3-.3 2.9-.7.7-.4 1.1-1.1 1.5-2.1l5 .2-1.2 25.2-5.9-.3.9-18.4-3.3-.2Z" style="stroke-width:0;fill:#67b96a"/><path d="M89.1 59.2v.4c.2 3.3.2 6.7-.6 10.3 0 0 3 13.2-5 22.5-5.6 6.5-12.9 12.5-30.4 0-5.4-4.3-5.5-10.6-6.1-17.4 0-4.6.3-10.4 1.4-15.8 1.2-6.3 3.4-12.1 6.9-14.6 6.5-4.7 18.8-4.8 25.4-.2 6.9 4.8 7.8 8.3 8.5 14.8Zm-47.4-18c-17.3 26.1-9.7 51.2-1.5 61.9.4.5 1 .8 1.7 1.1 1 .4 2.2.9 3.6 1.8 1.3.9 2.8 2.3 4.4 4.5 5.6 8.3 9.4 21.1 18 21.9 13.7 1.2 17-11.8 19.1-19.3.5-1.8.9-3.3 1.4-4.2.3-.5.5-1 .8-1.5 3.6-7.5 3.9-14.9 5.1-26.5.8-7.7.9-20-1.3-27.5s-7.7-14.8-14.8-18.6c-8.8-4.7-31.1-1.9-36.5 6.3Z" class="cls-4"/><path d="M78.2 63.8c.9-1.1 7.7-1.2 8.7.9l.3.3c.1 0 .2.2.2.3-1.9-.4-3.9-.6-5.8-.6-.6 0-1.2 0-1.8-.1s-1.2-.3-1.6-.8m-22.6.9c.4-1.4 9.8-3 11.7-1.3h.2c0 .6-.5 1.1-1.1 1.3s-1.2.3-1.8.2c-3-.7-6 0-8.9-.2Zm-7.3-5.5c-1.1 5.4-1.4 11.2-1.4 15.8.6 6.8.8 13.2 6.1 17.4 17.6 12.5 24.8 6.5 30.4 0 8-9.3 5-22.5 5-22.5.9-3.7.8-7 .6-10.3v-.4c-6.1-3.7-13.1-5.6-20.2-5.7-7.2 0-14.3 2-20.5 5.7h-.1Zm12.4 11.2c0-1.6.7-2.9 1.6-2.9s1.6 1.3 1.6 2.9-.7 2.9-1.6 2.9-1.6-1.3-1.6-2.9m19.9-.3c0-1.4.6-2.5 1.3-2.5s1.3 1.1 1.3 2.5-.6 2.5-1.3 2.5-1.3-1.1-1.3-2.5" class="cls-7"/><path d="M48.3 59.2h.1c6.1-3.7 13.3-5.7 20.5-5.7 7.1 0 14.2 2 20.2 5.7-.8-6.5-1.6-10-8.5-14.8-6.6-4.6-18.9-4.5-25.4.2-3.5 2.5-5.7 8.3-6.9 14.6" style="stroke-width:0;fill:#212121"/><path d="M55.6 64.7c3 .1 5.9-.5 8.9.2s1.2 0 1.8-.2 1.1-.7 1.1-1.2h-.2c-1.8-1.8-11.3-.2-11.7 1.2Zm6.7 2.8c-.9 0-1.6 1.3-1.6 2.9s.7 2.9 1.6 2.9 1.6-1.3 1.6-2.9-.7-2.9-1.6-2.9" class="cls-3"/><path d="m65.8 137.2-.2 3.7 3.3.2-.9 18.4 5.9.3 1.2-25.2-5-.2q-.45 1.5-1.5 2.1c-.7.4-1.6.6-2.9.7Z" class="cls-8"/><path d="M78.2 63.8c.4.4 1 .7 1.6.8s1.2 0 1.8.1c1.9 0 3.9.2 5.8.6 0-.1 0-.3-.2-.3l-.3-.3c-1-2.1-7.7-2-8.7-.9m3.7 3.8c-.7 0-1.3 1.1-1.3 2.5s.6 2.5 1.3 2.5 1.3-1.1 1.3-2.5-.6-2.5-1.3-2.5" class="cls-3"/><path d="M99.8 291c-2.9.2-7.6.6-9.1 1-2.4.6-3.2 1.9-4.3 3.9s-1.6 10.7.4 11.9c1.5.8 19.5 1.4 24.6 1.1.5 0 3.4-.6 3.8-.8 1.5-.7.8-8.8 0-10.2-1.8-3.4-9.2-6.1-13.2-7.1-.1 0-1 0-2.3.2Z" class="cls-8"/><path d="M96 144.8c3.2-2.5 7.3-6 10.2-7.8h.3c-2.3-4.5-4.8-9.4-5.8-11.2-2.7-5.1-7.2-14.5-11.5-18.3-.2.5-.5 1-.8 1.5-.5.9-.9 2.4-1.4 4.2.4 1.1 2.2 7.1 2.5 8.1 2.1 7.5 1 12.9-.2 17.7 1 2.3 2.7 4 4.6 7.5.7-.5 1.4-1 2.2-1.6Z" class="cls-5"/><path d="M88.3 165.8c.4 7 .8 14 .9 19.1 1.7-.4 2.8-1 3.8-3.8.8-2.1 1.2-4 1.9-6.2.1-.4.6-1.1 1.2-2-.4-3.5-3.5-6.9-6.8-8.2-.4.6-.8 1-1 1.1" class="cls-7"/><path d="M98.6 149.3c-1.4 2.4-2.4 5.2-3.6 7.5-.5.8-4 5.7-5.8 7.9 3.3 1.3 6.4 4.8 6.8 8.2 2-2.9 5.7-7.5 6.5-8.5l1.2-1.2c5.1-5.4 11.3-11.8 6.9-18.6-.7-1.1-2.4-4.2-4.1-7.7h-.3c-2.9 1.8-7 5.3-10.2 7.9 1.1 2 2.1 3.7 2.7 4.5Z" class="cls-8"/><path d="M89.2 107.5c4.2 3.8 8.8 13.3 11.5 18.3M30.6 143c3-2.7 5.7-6 8-9.1 3.1-4.2 5.5-8.2 6.6-10.4m-22.6 21.8c.6.2 1.2.3 1.7.5 1.7-1.2 2.5-1.9 4.2-3.5m13.4-38.1c-1.2 0-.7 0-1.8.5-3.5 1.5-9.2 7.5-11.6 10.9-.9 1.3-6.2 8.8-10.7 15.3-3.6 5.2-6.7 9.6-6.7 9.6m78.1 44.4c-10.4 11.3-37.6 8.3-54 .6M87 113.1c.4 1.1 2.2 7.1 2.5 8.1 2.1 7.5 1 12.9-.2 17.7-.8 3.1-1.6 5.9-1.6 9 0 4.9.3 11.4.6 17.9.4 7 .8 14 .9 19.1" class="cls-2"/><path d="M102.5 164.4c-.7 1.1-4.5 5.7-6.5 8.5-.6.9-1 1.6-1.2 2-.7 2.2-1.1 4-1.9 6.2-1 2.8-2.1 3.4-3.8 3.8m11.5-59.1c1.1 1.8 3.6 6.7 5.8 11.1 1.8 3.4 3.4 6.6 4.1 7.7 4.4 6.7-1.8 13.2-6.9 18.6l-1.2 1.2m-6.6-19.9c0 .1.1.2.2.4 1.1 2 2.1 3.7 2.7 4.5l.3.3m-9.7-10.8c1 2.3 2.7 4 4.6 7.5m1.2 10.4c-.5.8-4 5.7-5.8 7.9-.4.6-.8 1-1 1.1" class="cls-2"/><path d="M103.1 144.2c-1.9 1.2-3.3 3.1-4.5 5.1-1.4 2.4-2.4 5.2-3.6 7.5m-76.6 4.1c3.7 4.3 7.6 9.4 9.8 11.7l.3.3M11 140.5c-2.8 5 3.4 15 7.3 20.5m9.9-7.8q-.45-1.35-.9-2.4c-1.1-2.2-1.9-3.7-3-4.9m10.9 19.9c-2.1-.7-5.9-10.3-7-12.6" class="cls-2"/><path d="M43 169.4c.4.5 1.3 1.3 2.1 2.1 1.9 1.9 3.6 4.3-.6 5.3.8 2-.6 3.3-1.9 3.5 1.2 1.6-1.1 2.8-2.1 2.8.1 2.3-2 2.1-4.1 1.2-1.7-.7-3.5-1.9-4.1-2.5-2-1.9-5.2-6.3-4-9.1" class="cls-2"/><path d="M35.2 165.8c.8.3 1.9.4 3 .6 3.5.6 7.7 1.3 6.9 5.1M70 195c-2.1 1.8-4.8 5.3-5.9 6.3" class="cls-2"/><path d="M19.6 291.9c-2.8 1.2-7.6 4.2-8.4 6.9-.4 1.3-.3 7.2.7 8.2 1.1 1.2 3.1 1.3 4.8 1.3 5.4 0 10.9.1 16.3 0 2 0 5.8.3 7.2-1 1.7-1.6.6-10.9-.6-12.8-1.8-2.8-3.4-3.1-6.8-3.9-1.9-.4-4.2-.9-6.8-.7-2.1.1-4.2.6-6.4 1.8m66.8 4.2c-1.1 2-1.6 10.7.4 11.9 1.5.8 19.5 1.4 24.6 1.1.5 0 3.4-.6 3.8-.8 1.5-.7.8-8.8 0-10.2-1.8-3.4-9.2-6.1-13.2-7.1-.1 0-1 0-2.3.2-2.9.2-7.6.6-9.1 1-2.4.6-3.2 1.9-4.3 3.9m2.9-236.3c.2 3.3.2 6.7-.6 10.3 0 0 3 13.2-5 22.5-5.6 6.5-12.9 12.5-30.4 0" class="cls-1"/><path d="M86.9 64.7c-1-2.1-7.7-2-8.7-.9m-11-.4c-1.8-1.7-11.3-.1-11.7 1.2m25.1 5.5c0 1.4.6 2.5 1.3 2.5s1.3-1.1 1.3-2.5-.6-2.5-1.3-2.5-1.3 1.1-1.3 2.5m-19.9.3c0 1.6.7 2.9 1.6 2.9s1.6-1.3 1.6-2.9-.7-2.9-1.6-2.9-1.6 1.3-1.6 2.9m17.5 7.2c2.3 4.9-3.5 5.4-8.6 4.5M63 87.5c3.4 2.1 13 2.8 15.2.8" class="cls-1"/><path d="M35.2 184.3v1.2c-.4 5.5-1.5 27.4-1.6 28.2-1.2 9.5-.3 19.2-3.8 27.4-5.4 13-3.1 34.2-3.8 48.7m38.1-88.4c-.2 1.4-.5 2.8-.8 4.1-2.8 13.6-7.7 23-8.8 35.8-1.3 15.7-11.1 31.9-15.1 53.3m49.8-109.7c4.3 12.5 4.9 45.9 7.6 55.8 3.4 12.9 2.5 35 3.1 50.3v.2" class="cls-2"/><path d="m63.2 204.9.2.6c4.1 16.4 6.6 17.4 7.7 35 .8 13.2 12.5 33.6 15.4 55.4m-47.9-162c3 13.4 2.4 21-.3 32.3" class="cls-2"/><path d="M46.9 75c.6 6.8.8 13.2 6.1 17.4m36.2-32.8v-.4c-.8-6.5-1.6-10-8.5-14.8-6.6-4.6-18.9-4.5-25.4.2-3.5 2.5-5.7 8.3-6.9 14.6C47.3 64.6 47 70.4 47 75" class="cls-1"/><path d="M41.9 104.2c1 .4 2.2.9 3.6 1.8 1.3.9 2.8 2.3 4.4 4.5 5.6 8.3 9.4 21.1 18 21.9 13.7 1.2 17-11.8 19.1-19.3.5-1.8.9-3.3 1.4-4.2.3-.5.5-1 .8-1.5 3.6-7.5 3.9-14.9 5.1-26.5.8-7.7.9-20-1.3-27.5s-7.7-14.8-14.8-18.6c-8.8-4.7-31.1-1.9-36.5 6.3C24.4 67.2 32 92.3 40.2 103c.4.5 1 .8 1.7 1.1" class="cls-1"/><path d="M67.4 63.5c0 .6-.5 1-1.1 1.2s-1.2.3-1.8.2c-3-.7-6 0-8.9-.2h0m22.6-.9s0 0 0 0c.4.4 1 .6 1.6.8.6.1 1.2 0 1.8.1 1.9 0 3.9.2 5.8.6 0-.1 0-.3-.2-.3" class="cls-1"/><path d="M45.5 106c3.3 3.7 2.3 12.3-.3 17.5M18.1 131c2.9 5.3 7.4 9.7 10.4 11.3.8.4 1.5.7 2 .7m63.3 3.4c.7-.5 1.4-1 2.2-1.6 3.2-2.5 7.3-6 10.2-7.8m-71 28.8c-3.2 1-6.1 3.6-7 6.8m60.7-8c.1 0 .3 0 .4.1 3.3 1.3 6.4 4.8 6.8 8.2M74 159.8l-5.9-.3.9-18.4-3.3-.2.2-3.7c1.3 0 2.3-.3 2.9-.7.7-.4 1.1-1.1 1.5-2.1l5 .2-1.2 25.2Z" class="cls-2"/><path d="M48.4 59.2c6.1-3.7 13.3-5.7 20.5-5.7 7.1 0 14.2 2 20.2 5.7 0 0 .1 0 .2.1" class="cls-1"/></svg>')}`;
export default image;