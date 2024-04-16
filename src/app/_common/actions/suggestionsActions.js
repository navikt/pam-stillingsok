'use server';

import capitalizeFirstLetter from '@/app/_common/utils/capitalizeFirstLetter';
import { getDefaultHeaders } from '@/app/_common/utils/fetch';
import logger from '@/app/_common/utils/logger';

function suggest(field, match) {
  return {
    prefix: match,
    completion: {
      field,
      skip_duplicates: true,
      contexts: {
        status: 'ACTIVE',
      },
      size: 10,
    },
  };
}

const suggestionsTemplate = (match, minLength) => ({
  suggest: {
    category_suggest: {
      ...suggest('category_name_suggest', match, minLength),
    },
    searchtags_suggest: {
      ...suggest('searchtags_suggest', match, minLength),
    },
  },
  _source: false,
});

/**
 * Use new Set to remove duplicates across category_suggest and searchtags_suggest
 */
function removeDuplicateSuggestions(result) {
  return [
    ...new Set(
      [
        ...result.suggest.searchtags_suggest[0].options.map((suggestion) => capitalizeFirstLetter(suggestion.text)),
        ...result.suggest.category_suggest[0].options.map((suggestion) => capitalizeFirstLetter(suggestion.text)),
      ].sort(),
    ),
  ].slice(0, 10);
}

export async function getSuggestions(match, minLength) {
  try {
    const body = suggestionsTemplate(match, minLength);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(body),
    });
    let data = await res.json();
    data = removeDuplicateSuggestions(data);
    return data;
  } catch (e) {
    logger.error('getSuggestions error', { error: e });
    return [];
  }
}
