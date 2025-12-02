
import { defineEventHandler, getRequestURL } from 'h3';

export default defineEventHandler((event) => {
    console.log("Accediendo a:", getRequestURL(event));
});