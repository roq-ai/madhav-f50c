const mapping: Record<string, string> = {
  garments: 'garment',
  orders: 'order',
  organizations: 'organization',
  tailors: 'tailor',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
