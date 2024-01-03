import { useNavigate } from "react-router-dom";

function ProductCard({ data }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/products/description", { state: { ...data } })}
      className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700"
    >
      <div className="overflow-hidden">
        <img
          src={data?.image?.secure_url}
          alt="product thumbnail"
          className="h-48 w-full rounded-lg rounded-tr-lg group-hover::scale=[1,2] transition-all ease-in-out duration-300"
        />
        <div className="p-3 space-y-1 text-white">
          <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
            {data?.name}
          </h2>
          <p className="line-clamp-2">{data?.description}</p>
          <p className="font-semibold">
            <span className="text-yellow-500 font-bold">Price : </span>
            {data?.price}
          </p>
          <p className="font-semibold">
            <span className="text-yellow-500 font-bold">Category : </span>
            {data?.category}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
