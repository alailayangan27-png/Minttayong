import { supabase } from "../lib/supabase.js";

export default async function handler(req, res){

  const { wallet, amount } = req.body;

  if(!wallet || !amount){
    return res.json({ error:"Invalid" });
  }

  const { data } = await supabase
    .from("mints")
    .select("*")
    .eq("wallet", wallet)
    .single();

  const total = data?.total_sol || 0;

  if(total + amount > 1){
    return res.json({ error:"Limit exceeded" });
  }

  await supabase.from("mints").upsert({
    wallet,
    total_sol: total + amount
  });

  res.json({ success:true });
}
