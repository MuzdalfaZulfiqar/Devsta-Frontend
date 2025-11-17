import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
import { fetchUserById } from "../../api/connections";
import { getPostsByUser } from "../../api/post";
import PostCard from "../../components/networking/PostCard";
import { UserPlus, Github, BookOpen, Briefcase, User, Zap, Star } from "lucide-react";
import { useRoleMap } from "../../hooks/useRoleMap";
import { useConnections } from "../../context/ConnectionContext";
import { useNavigate } from "react-router-dom";

export default function PublicProfilePage() {
  const { formatRole } = useRoleMap();
  const { userId } = useParams();
  const { connections, updateConnection, setConnection } = useConnections();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const accentColor = "#e6f4f1";
  const navigate = useNavigate();

  const connection = connections[userId] || { connectionStatus: "none" };

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await fetchUserById(userId);
      setUser({
        topSkills: [],
        interests: [],
        education: [],
        experience: [],
        socialLinks: {},
        githubProfile: {},
        ...data,
      });
      if (data.connection) {
        setConnection(userId, data.connection);
      }
    } catch (err) {
      console.error("loadUser error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user || connecting) return;
    setConnecting(true);
    try {
      await updateConnection(userId, connection.connectionStatus === "pending_received" ? "accept" : "connect");
    } catch (err) {
      console.error("Connection action failed:", err);
      await loadUser();
    } finally {
      setConnecting(false);
    }
  };

  const handleMessage = () => {
    // Navigate to messaging page and pass userId as query/state
    navigate("/dashboard/community/messaging", { state: { targetUserId: userId } });
  };


  useEffect(() => {
    loadUser();
  }, [userId]);

  useEffect(() => {
    if (activeTab !== "posts") return;
    const loadPosts = async () => {
      setPostsLoading(true);
      try {
        const res = await getPostsByUser(userId);
        setPosts(res.items || []);
      } catch (err) {
        console.error("loadPosts error:", err);
      } finally {
        setPostsLoading(false);
      }
    };
    loadPosts();
  }, [activeTab, userId]);

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (!user) return <p className="text-center text-red-500 py-10">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
        <div className="flex items-center gap-4">
          <DevstaAvatar
            user={user.githubProfile?.avatar_url ? { ...user, avatar: user.githubProfile.avatar_url } : user}
            size={120}
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold truncate">{user.name || user.githubProfile?.name}</h1>
            <p className="text-gray-500 text-lg">{formatRole(user.primaryRole) || "Developer"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user.githubProfile?.html_url && (
            <a
              href={user.githubProfile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 shadow-sm"
            >
              <Github size={18} /> GitHub
            </a>
          )}
          {!user.isSelf && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm
                ${
                  ["none", "cancelled", "declined"].includes(connection.connectionStatus)
                    ? "bg-primary text-white hover:bg-primary/90"
                    : connection.connectionStatus === "pending_sent"
                    ? "bg-yellow-100 text-yellow-700 cursor-default"
                    : connection.connectionStatus === "accepted"
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-gray-300 text-gray-800"
                }`}
              onClick={handleConnect}
              disabled={connecting || ["pending_sent", "accepted"].includes(connection.connectionStatus)}
            >
              <UserPlus size={18} />
              {connecting ? (
                "Loading..."
              ) : ["none", "cancelled", "declined"].includes(connection.connectionStatus) ? (
                "Connect"
              ) : connection.connectionStatus === "pending_sent" ? (
                "Requested"
              ) : connection.connectionStatus === "accepted" ? (
                "Connected"
              ) : (
                "Connect"
              )}
            </button>
          )}
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
        <div className="flex items-center gap-4">
          <DevstaAvatar
            user={user.githubProfile?.avatar_url ? { ...user, avatar: user.githubProfile.avatar_url } : user}
            size={120}
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold truncate">{user.name || user.githubProfile?.name}</h1>
            <p className="text-gray-500 text-lg">{formatRole(user.primaryRole) || "Developer"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user.githubProfile?.html_url && (
            <a
              href={user.githubProfile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 shadow-sm"
            >
              <Github size={18} /> GitHub
            </a>
          )}

          {!user.isSelf && connection.connectionStatus !== "accepted" && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm
                ${["none", "cancelled", "declined"].includes(connection.connectionStatus)
                  ? "bg-primary text-white hover:bg-primary/90"
                  : connection.connectionStatus === "pending_sent"
                    ? "bg-yellow-100 text-yellow-700 cursor-default"
                    : "bg-gray-300 text-gray-800"
                }`}
              onClick={handleConnect}
              disabled={connecting || ["pending_sent", "accepted"].includes(connection.connectionStatus)}
            >
              <UserPlus size={18} />
              {connecting
                ? "Loading..."
                : ["none", "cancelled", "declined"].includes(connection.connectionStatus)
                  ? "Connect"
                  : connection.connectionStatus === "pending_sent"
                    ? "Requested"
                    : "Connect"
              }
            </button>
          )}

          {/* ✅ Show Message button only if connected */}
          {!user.isSelf && connection.connectionStatus === "accepted" && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary shadow-sm"
              onClick={handleMessage}
            >
              <UserPlus size={18} /> Message
            </button>
          )}
        </div>
      </div>
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
          onClick={() => setActiveTab("details")}
        >
          Personal Details
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === "posts" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
      </div>
      {activeTab === "details" && (
        <div className="space-y-4">
          {user.bio && (
            <section className="p-4 rounded-xl shadow-sm flex items-start gap-2 border border-gray-200">
              <User size={20} className="text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-lg text-primary">About</h3>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            </section>
          )}
          {user.topSkills?.length > 0 && (
            <section className="p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-primary" />
                <h3 className="font-semibold text-lg text-primary">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.topSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill.replace("custom:", "")}
                  </span>
                ))}
              </div>
            </section>
          )}
          {user.interests?.length > 0 && (
            <section className="p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Star size={20} className="text-primary" />
                <h3 className="font-semibold text-lg text-primary">Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
          {user.education?.length > 0 && (
            <section className="p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={20} className="text-primary" />
                <h3 className="font-semibold text-lg text-primary">Education</h3>
              </div>
              <div className="space-y-3">
                {user.education.map((edu) => (
                  <div
                    key={edu._id}
                    className="p-3 rounded-xl border border-gray-300"
                    style={{ backgroundColor: "#f9fdfd" }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold">
                        {edu.degreeTitle} in {edu.fieldOfStudy}
                      </h4>
                      <span className="text-gray-500 text-sm">
                        {edu.startYear} – {edu.endYear || "Present"}
                      </span>
                    </div>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.marksPercent && (
                      <p className="text-gray-500 text-sm mt-1">Marks: {edu.marksPercent}%</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {user.experience?.length > 0 && (
            <section className="p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={20} className="text-primary" />
                <h3 className="font-semibold text-lg text-primary">Experience</h3>
              </div>
              <div className="space-y-3">
                {user.experience.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-3 rounded-xl border border-gray-300"
                    style={{ backgroundColor: "#f9fdfd" }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold">
                        {exp.position} @ {exp.company}
                      </h4>
                      <span className="text-gray-500 text-sm">
                        {new Date(exp.startDate).getFullYear()} –{" "}
                        {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
            <section className="p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus size={20} className="text-primary" />
                <h3 className="font-semibold text-lg text-primary">Connect</h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(user.socialLinks).map(([k, url]) => (
                  <a
                    key={k}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium flex items-center gap-1"
                    style={{ backgroundColor: accentColor }}
                  >
                    {k}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {postsLoading ? (
            <p className="text-gray-500 text-center py-6">Loading posts…</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      )}
    </div>
  );
}