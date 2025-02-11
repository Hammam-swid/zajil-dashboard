import MainStatistics from "@/components/organisms/MainStatistics";
import TopStores from "@/components/organisms/TopStores";
import ProductStats from "@/components/organisms/ProductStats";

const DBHome = () => {
  return (
    <div className="relative space-y-5 p-6">
      {/* Summary */}
      <MainStatistics />

      <div className="grid grid-cols-12 gap-5">
        <TopStores />

        <ProductStats />
      </div>
    </div>
  );
};

export default DBHome;
