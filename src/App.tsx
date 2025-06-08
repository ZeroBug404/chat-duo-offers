import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import OrderTracking from "./components/OrderTracking";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Offers from "./pages/Offers";
import PersonA from "./pages/PersonA";
import PersonB from "./pages/PersonB";
import { ProductProvider } from "./utils/productContext";
import ChatManager from "./components/ChatManager";
import CreateChat from "./components/CreateChat";
import AllChats from "./components/AllChats";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Index />} /> */}
            <Route path="/" element={<ChatManager />} />
            <Route path="/person-a" element={<PersonA />} />
            <Route path="/person-b" element={<PersonB />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/chat-manager" element={<ChatManager />} />
            <Route path="/chat-manager/create" element={<CreateChat />} />
            <Route path="/chat-manager/all" element={<AllChats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
