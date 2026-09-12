import { IconName } from "../../shared/icon/icon";

export interface ClinicService {
    id: string;
    number: string;
    title: string;
    description: string;
    icon: IconName;
    accent: 'pink' | 'violet';
}