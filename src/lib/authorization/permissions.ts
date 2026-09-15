export const permissions = {
  lotsRead: "lots.read",
  lotsWrite: "lots.write",
  lotsPublish: "lots.publish",
  ordersRead: "orders.read",
  ordersCreate: "orders.create",
  ordersApprove: "orders.approve",
  shipmentsRead: "shipments.read",
  shipmentsDispatch: "shipments.dispatch",
  shipmentPositionWrite: "shipment.position.write",
  settlementsRead: "settlements.read",
  settlementsReconcile: "settlements.reconcile",
  settlementsReleaseRequest: "settlements.release.request",
  membersRead: "members.read",
  membersInvite: "members.invite",
  membersManage: "members.manage",
  organizationManage: "organization.manage",
  filesUpload: "files.upload",
  filesReadPrivate: "files.read_private",
  disputesManage: "disputes.manage",
  platformConfigure: "platform.configure",
  platformAuditCaseRead: "platform.audit_case.read",
  supportMetadataRead: "support.metadata.read",
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];

export type OrganizationRole =
  | "fpo_owner" | "fpo_admin" | "fpo_operator" | "fpo_finance"
  | "buyer_owner" | "buyer_procurement" | "buyer_finance"
  | "logistics_owner" | "logistics_dispatcher" | "logistics_driver";

export type PlatformRole = "platform_admin" | "compliance_auditor" | "support_agent";
export type RoleKey = OrganizationRole | PlatformRole;

export function hasPermission(granted: ReadonlySet<string> | readonly string[], required: Permission) {
  return Array.isArray(granted) ? granted.includes(required) : (granted as ReadonlySet<string>).has(required);
}

export function roleHome(locale: string, role: RoleKey, organizationSlug?: string) {
  const prefix = `/${locale}`;
  if (role === "platform_admin" || role === "compliance_auditor" || role === "support_agent") return `${prefix}/platform/admin`;
  if (!organizationSlug) return `${prefix}/organizations`;
  if (role.startsWith("fpo_")) return `${prefix}/fpo/${organizationSlug}/dashboard`;
  if (role.startsWith("buyer_")) return `${prefix}/buyer/${organizationSlug}/marketplace`;
  if (role === "logistics_driver") return `${prefix}/logistics/${organizationSlug}/trips`;
  return `${prefix}/logistics/${organizationSlug}/dispatch`;
}
