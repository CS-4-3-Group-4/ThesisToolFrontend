import ax from "@/lib/axios";

export async function getExample() {
  const response = await ax.get("/");
  const data = response.data;
  return data;
}
