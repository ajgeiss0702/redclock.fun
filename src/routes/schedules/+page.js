import {load as l} from '../schools/+page.js';

export async function load({fetch}) {
    return l({fetch});
}