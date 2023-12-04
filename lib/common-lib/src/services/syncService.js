import { facilitatorRegistryService } from '..';
import { getData, getAllKeys } from './DBService';

async function getForms() {
  const allKeys = await getAllKeys()
  const formKeys = allKeys.filter((key) => key.startsWith('form_'))
  console.log('forms', formKeys)

  return Promise.all(formKeys.map(async (key) => getData(key)))
}

export const syncForms = async () => {
  const forms = await getForms()
  forms.map(async(item) => {
    switch (item.formServiceFunction) {
      case 'profileStapeUpdate':
        const response = await facilitatorRegistryService.profileStapeUpdate(item.payload);
        console.log("response", response);
        break;
    }
  });
  console.log(forms)
}
