import { createChef, storeImage } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    console.log("Received request to create chef");
    const formData = await request.formData();
    const imageUrl = formData.get("image_url") as string;
    const user_id = formData.get("user_id") as string;
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const niches = JSON.parse(formData.get("niches") as string);
    const subFee = parseFloat(formData.get("subFee") as string);
    const nftName = formData.get("nft_name") as string;
    const nftSymbol = formData.get("nft_symbol") as string;
    const ipAddress = formData.get("ip_address") as string;
    const twitter = formData.get("twitter") as string;
    const royalty = formData.get("royalty") as string;
    const chefScore = formData.get("chef_score") as string;

    console.log("Creating chef with data:", {
      user_id,
      name,
      bio,
      image: imageUrl,
      niche: niches,
      sub_fee: subFee.toString(),
      nftName,
      nftSymbol,
      ipAddress,
      twitter,
      royalty,
      chefScore,
    });
    const chef = await createChef({
      user_id,
      name,
      bio,
      image: imageUrl,
      niche: niches,
      sub_fee: subFee.toString(),
      nftName,
      nftSymbol,
      ipAddress,
      twitter,
      royalty,
      chefScore,
    });

    if (!chef) {
      console.error("Error creating chef");
      return Response.json({ error: "Error creating chef" }, { status: 500 });
    }

    console.log("Chef created successfully:", chef);
    return Response.json({ chef });
  } catch (error) {
    console.error("Internal server error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
