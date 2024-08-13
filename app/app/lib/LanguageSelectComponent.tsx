import { Select, SelectedItems, SelectItem } from "@nextui-org/select";
import { Avatar } from "@nextui-org/avatar";

import { Component } from "@/components/component";
import { Language } from "@/config/prompt";

type LanguageSelectComponentProps = {
  value: Language;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

type SelectLanguage = {
  code: string;
  name: string;
}

const languages: SelectLanguage[] = [
  { code: "us", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "ae", name: "Arabic" },
  { code: "ar", name: "Argentinian" },
  { code: "au", name: "Australian" },
  { code: "br", name: "Brazilian" },
  { code: "jp", name: "Japanese" },
  { code: "ua", name: "Ukrainian" },
  { code: "kr", name: "Korean" },
  { code: "tr", name: "Turkish" }
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
        <SelectItem key={language.name} textValue={language.name} value={language.name.toLowerCase()}>
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