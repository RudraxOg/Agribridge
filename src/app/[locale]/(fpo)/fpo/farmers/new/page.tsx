import { FarmerWizard } from "@/components/features/farmer-wizard"; import { PageHeader } from "@/components/shell/page-header";
export default function NewFarmerPage(){return <><PageHeader eyebrow="Assisted registration" title="Register a farmer" description="Use plain language, record consent and offer an alternative to biometric checks. Drafts are saved on this device."/><FarmerWizard/></>}
