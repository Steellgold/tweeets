import { Select, SelectedItems, SelectItem } from "@nextui-org/select";
import { Avatar } from "@nextui-org/avatar";

import { Component } from "@/components/component";
import { Language } from "@/config/prompt";

type LanguageSelectComponentProps = {
  value: Language;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

type SelectLanguage = {
  id: string;
  code: string;
  name: string;
}

const languages: SelectLanguage[] = [
  { code: "us", name: "English", id: "english" },
  { code: "fr", name: "French", id: "french" },
  { code: "es", name: "Spanish", id: "spanish" },
  { code: "it", name: "Italian", id: "italian" },
  { code: "pt", name: "Portuguese", id: "portuguese" },
  { code: "de", name: "German", id: "german" },
  { code: "ae", name: "Arabic", id: "arabic" },
  { code: "ar", name: "Argentinian", id: "argentinian" },
  { code: "au", name: "Australian", id: "australian" },
  { code: "br", name: "Brazilian", id: "brazilian" },
  { code: "jp", name: "Japanese", id: "japanese" },
  { code: "ua", name: "Ukrainian", id: "ukrainian" },
  { code: "kr", name: "Korean", id: "korean" },
  { code: "tr", name: "Turkish", id: "turkish" }
];

export const LanguageSelectComponent: Component<LanguageSelectComponentProps> = ({ value, onChange }) => {
  return (
    <Select
      className="max-w-full"
      defaultSelectedKeys={["English"]}
      items={languages}
      renderValue={(items: SelectedItems<SelectLanguage>) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center flex-wrap gap-2">
            <Avatar
              alt={item.data?.name}
              className="flex-shrink-0 w-6 h-6"
              src={`https://flagcdn.com/${item.data?.code}.svg`}
            />
            <span>{item.data?.name}</span>
          </div>
        ));
      }}
      onChange={onChange}
    >
      {(language) => (
        <SelectItem key={language.name} textValue={language.name} value={language.id}>
          <div className="flex items-center gap-2">
            <Avatar
              alt={language.name}
              className="flex-shrink-0 w-6 h-6"
              src={`https://flagcdn.com/${language.code}.svg`}
            />
            <span>{language.name}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}