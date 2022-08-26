import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { OptionsType, OptionTypeBase } from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import GooglePlacesAutocompleteProps, {
  // AutocompletionRequest,
  GooglePlacesAutocompleteHandle,
} from './GooglePlacesAutocomplete.types';
// import autocompletionRequestBuilder from './helpers/autocompletionRequestBuilder';
import { Loader } from '@googlemaps/js-api-loader';

const predictions = [
  {
     "description" : "Екатеринбург, Россия",
     "matched_substrings" : [
        {
           "length" : 1,
           "offset" : 0
        }
     ],
     "place_id" : "ChIJS9tioOplwUMRIH9W99dDAtU",
     "reference" : "ChIJS9tioOplwUMRIH9W99dDAtU",
     "structured_formatting" : {
        "main_text" : "Екатеринбург",
        "main_text_matched_substrings" : [
           {
              "length" : 1,
              "offset" : 0
           }
        ],
        "secondary_text" : "Россия"
     },
     "terms" : [
        {
           "offset" : 0,
           "value" : "Екатеринбург"
        },
        {
           "offset" : 14,
           "value" : "Россия"
        }
     ],
     "types" : [ "locality", "political", "geocode" ]
  },
  {
     "description" : "Ейск, Краснодарский край, Россия",
     "matched_substrings" : [
        {
           "length" : 1,
           "offset" : 0
        }
     ],
     "place_id" : "ChIJi6qpwTss5EARDrzwMmw4vmI",
     "reference" : "ChIJi6qpwTss5EARDrzwMmw4vmI",
     "structured_formatting" : {
        "main_text" : "Ейск",
        "main_text_matched_substrings" : [
           {
              "length" : 1,
              "offset" : 0
           }
        ],
        "secondary_text" : "Краснодарский край, Россия"
     },
     "terms" : [
        {
           "offset" : 0,
           "value" : "Ейск"
        },
        {
           "offset" : 6,
           "value" : "Краснодарский край"
        },
        {
           "offset" : 26,
           "value" : "Россия"
        }
     ],
     "types" : [ "locality", "political", "geocode" ]
  },
  {
     "description" : "Ереван, Армения",
     "matched_substrings" : [
        {
           "length" : 1,
           "offset" : 0
        }
     ],
     "place_id" : "ChIJW4v8uNqiakARalLah655FD0",
     "reference" : "ChIJW4v8uNqiakARalLah655FD0",
     "structured_formatting" : {
        "main_text" : "Ереван",
        "main_text_matched_substrings" : [
           {
              "length" : 1,
              "offset" : 0
           }
        ],
        "secondary_text" : "Армения"
     },
     "terms" : [
        {
           "offset" : 0,
           "value" : "Ереван"
        },
        {
           "offset" : 8,
           "value" : "Армения"
        }
     ],
     "types" : [ "locality", "political", "geocode" ]
  },
  {
     "description" : "Евпатория",
     "matched_substrings" : [
        {
           "length" : 1,
           "offset" : 0
        }
     ],
     "place_id" : "ChIJrSsimo4fwEARhrNapSKb8mc",
     "reference" : "ChIJrSsimo4fwEARhrNapSKb8mc",
     "structured_formatting" : {
        "main_text" : "Евпатория",
        "main_text_matched_substrings" : [
           {
              "length" : 1,
              "offset" : 0
           }
        ]
     },
     "terms" : [
        {
           "offset" : 0,
           "value" : "Евпатория"
        }
     ],
     "types" : [ "locality", "political", "geocode" ]
  },
  {
     "description" : "Еленовка, Донецкая область, Украина",
     "matched_substrings" : [
        {
           "length" : 1,
           "offset" : 0
        }
     ],
     "place_id" : "ChIJ0WfuUqy-4EARhyqJfY541dU",
     "reference" : "ChIJ0WfuUqy-4EARhyqJfY541dU",
     "structured_formatting" : {
        "main_text" : "Еленовка",
        "main_text_matched_substrings" : [
           {
              "length" : 1,
              "offset" : 0
           }
        ],
        "secondary_text" : "Донецкая область, Украина"
     },
     "terms" : [
        {
           "offset" : 0,
           "value" : "Еленовка"
        },
        {
           "offset" : 10,
           "value" : "Донецкая область"
        },
        {
           "offset" : 28,
           "value" : "Украина"
        }
     ],
     "types" : [ "locality", "political", "geocode" ]
  }
]

const GooglePlacesAutocomplete: React.ForwardRefRenderFunction<GooglePlacesAutocompleteHandle, GooglePlacesAutocompleteProps> = ({
  apiKey = '',
  apiOptions = {},
  // autocompletionRequest = {},
  debounce = 300,
  minLengthAutocomplete = 0,
  selectProps = {},
  onLoadFailed = console.error,
  // withSessionToken = false,
} : GooglePlacesAutocompleteProps, ref) : React.ReactElement => {
  const [placesService, setPlacesService] = useState<google.maps.places.AutocompleteService | undefined>(undefined);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | undefined>(undefined);
  const [fetchSuggestions] = useDebouncedCallback((value: string, cb: (options: OptionsType<OptionTypeBase>) => void): void => {
    if (!placesService) return cb([]);
    if (value.length < minLengthAutocomplete) return cb([]);

    console.log('GooglePlacesAutocomplete useDebouncedCallback value', value);
    // return cb([]);
    return cb(predictions);

    // const autocompletionReq: AutocompletionRequest = { ...autocompletionRequest };

    // placesService.getPlacePredictions(
    //   autocompletionRequestBuilder(
    //     autocompletionReq,
    //     value,
    //     withSessionToken && sessionToken,
    //   ), (suggestions) => {
    //     cb((suggestions || []).map(suggestion => ({ label: suggestion.description, value: suggestion })));
    //   },
    // );
  }, debounce);

  const initializeService = () => {
    if (!window.google) throw new Error('[react-google-places-autocomplete]: Google script not loaded');
    if (!window.google.maps) throw new Error('[react-google-places-autocomplete]: Google maps script not loaded');
    if (!window.google.maps.places) throw new Error('[react-google-places-autocomplete]: Google maps places script not loaded');

    setPlacesService(new window.google.maps.places.AutocompleteService());
    setSessionToken(new google.maps.places.AutocompleteSessionToken());
  }

  useImperativeHandle(ref, () => ({
    getSessionToken: () => {
      return sessionToken;
    },
    refreshSessionToken: () => {
      setSessionToken(new google.maps.places.AutocompleteSessionToken());
    }
  }), [sessionToken]);

  useEffect(() => {
    const init = async () => {
      try {
        if ( !window.google || !window.google.maps || !window.google.maps.places ) {
          await new Loader({ apiKey, ...{ libraries: ['places'], ...apiOptions }}).load();
        }
        initializeService();
      } catch (error) {
        onLoadFailed(error);
      }
    }

    if (apiKey) init();
    else initializeService();
  }, []);

  return (
    <AsyncSelect
      {...selectProps}
      loadOptions={fetchSuggestions}
      getOptionValue={({ value }) => value.place_id}
    />
  );
};

export default forwardRef(GooglePlacesAutocomplete);
